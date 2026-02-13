'use client';

import { useState, useCallback, useRef } from 'react';

export interface ProgressData {
  value: number;
  max: number;
  percentage: number;
  stage: string;
}

export function useComfyUI() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const clientIdRef = useRef<string>(`nextjs-${Date.now()}-${Math.random()}`);

  const connectWebSocket = useCallback((promptId: string) => {
    return new Promise<void>((resolve, reject) => {
      let wsConnected = false;
      let hasReceivedProgress = false;
      
      try {
        // WebSocket 연결 시도
        const ws = new WebSocket(`ws://127.0.0.1:8188/ws?clientId=${clientIdRef.current}`);
        wsRef.current = ws;

        // 연결 타임아웃 (5초 내에 연결 안되면 포기)
        const connectionTimeout = setTimeout(() => {
          if (!wsConnected) {
            console.warn('WebSocket 연결 타임아웃, 폴링 모드로 전환');
            ws.close();
            reject(new Error('WebSocket 연결 실패'));
          }
        }, 5000);

        ws.onopen = () => {
          wsConnected = true;
          clearTimeout(connectionTimeout);
          console.log('✅ WebSocket 연결 성공');
          
          // 초기 진행 상태 설정
          setProgress({
            value: 0,
            max: 100,
            percentage: 0,
            stage: '처리 시작'
          });
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // 진행 상황 업데이트
            if (data.type === 'progress') {
              hasReceivedProgress = true;
              const progressData = data.data;
              setProgress({
                value: progressData.value,
                max: progressData.max,
                percentage: Math.round((progressData.value / progressData.max) * 100),
                stage: '이미지 생성 중'
              });
            }
            
            // 실행 시작
            if (data.type === 'executing' && data.data.node) {
              if (!hasReceivedProgress) {
                setProgress(prev => ({
                  value: prev?.value || 0,
                  max: prev?.max || 100,
                  percentage: prev?.percentage || 5,
                  stage: '처리 중...'
                }));
              }
            }

            // 실행 완료
            if (data.type === 'executing' && data.data.node === null) {
              setProgress({
                value: 100,
                max: 100,
                percentage: 100,
                stage: '완료'
              });
              ws.close();
              resolve();
            }
          } catch (e) {
            console.error('WebSocket 메시지 파싱 오류:', e);
          }
        };

        ws.onerror = (error) => {
          console.warn('WebSocket 오류 (무시됨):', error);
          clearTimeout(connectionTimeout);
          // 에러가 발생해도 reject하지 않고 폴링으로 처리하도록 함
          if (!wsConnected) {
            reject(new Error('WebSocket 연결 실패'));
          }
        };

        ws.onclose = () => {
          console.log('WebSocket 연결 종료');
          clearTimeout(connectionTimeout);
        };

        // 전체 타임아웃 (120초)
        setTimeout(() => {
          if (ws.readyState !== WebSocket.CLOSED) {
            ws.close();
            reject(new Error('생성 시간 초과'));
          }
        }, 120000);

      } catch (error) {
        console.error('WebSocket 초기화 오류:', error);
        reject(error);
      }
    });
  }, []);

  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(null);
  }, []);

  return {
    progress,
    clientId: clientIdRef.current,
    connectWebSocket,
    disconnectWebSocket,
    resetProgress,
  };
}
