import { NextRequest, NextResponse } from 'next/server';
import { MOVIE_STYLES } from '@/constants/movieStyles';
import { GenerateRequest, GenerateResponse } from '@/types';

// ComfyUI API 엔드포인트
const COMFYUI_API_URL = 'http://localhost:8188';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('📥 [API] 이미지 생성 요청 수신:', new Date().toISOString());
  
  try {
    const body: GenerateRequest & { clientId?: string } = await request.json();
    const { style, userInput, clientId } = body;

    console.log('📝 [API] 요청 내용:', { style, userInput, clientId });

    // 입력 검증
    if (!style || !userInput) {
      console.error('❌ [API] 입력 검증 실패');
      return NextResponse.json(
        { error: '스타일과 입력 텍스트를 모두 제공해야 합니다.' },
        { status: 400 }
      );
    }

    // 선택한 스타일 프리셋 찾기
    const selectedStyle = MOVIE_STYLES.find((s) => s.id === style);
    if (!selectedStyle) {
      console.error('❌ [API] 유효하지 않은 스타일:', style);
      return NextResponse.json(
        { error: '유효하지 않은 스타일입니다.' },
        { status: 400 }
      );
    }

    // 최종 프롬프트 생성
    const finalPrompt = `${userInput}, ${selectedStyle.prompt}`;
    const negativePrompt = selectedStyle.negative;
    
    console.log('🎨 [API] 프롬프트 생성 완료:', { finalPrompt, negativePrompt });

    // ComfyUI 워크플로우 생성
    const workflow = {
      "3": {
        "inputs": {
          "seed": Math.floor(Math.random() * 1000000000),
          "steps": 20,
          "cfg": 7,
          "sampler_name": "euler",
          "scheduler": "normal",
          "denoise": 1,
          "model": ["4", 0],
          "positive": ["6", 0],
          "negative": ["7", 0],
          "latent_image": ["5", 0]
        },
        "class_type": "KSampler"
      },
      "4": {
        "inputs": {
          "ckpt_name": "v1-5-pruned-emaonly.safetensors"
        },
        "class_type": "CheckpointLoaderSimple"
      },
      "5": {
        "inputs": {
          "width": 512,
          "height": 512,
          "batch_size": 1
        },
        "class_type": "EmptyLatentImage"
      },
      "6": {
        "inputs": {
          "text": finalPrompt,
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "7": {
        "inputs": {
          "text": negativePrompt,
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "8": {
        "inputs": {
          "samples": ["3", 0],
          "vae": ["4", 2]
        },
        "class_type": "VAEDecode"
      },
      "9": {
        "inputs": {
          "filename_prefix": "ComfyUI",
          "images": ["8", 0]
        },
        "class_type": "SaveImage"
      }
    };

    // ComfyUI API 호출
    console.log('🚀 [API] ComfyUI에 워크플로우 전송 중...');
    
    const promptResponse = await fetch(`${COMFYUI_API_URL}/prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: workflow,
        client_id: clientId || `nextjs-${Date.now()}`,
      }),
    });

    if (!promptResponse.ok) {
      const errorText = await promptResponse.text();
      console.error('❌ [API] ComfyUI API 오류:', promptResponse.status, errorText);
      throw new Error(`ComfyUI API 오류: ${promptResponse.statusText}`);
    }

    const promptResult = await promptResponse.json();
    const promptId = promptResult.prompt_id;

    console.log(`✅ [API] 워크플로우 제출 완료! Prompt ID: ${promptId}`);

    // 이미지 생성 완료 대기 (폴링)
    console.log('⏳ [API] 이미지 생성 대기 중... (최대 120초)');
    let imageReady = false;
    let attempts = 0;
    const maxAttempts = 120; // 최대 120초 대기

    while (!imageReady && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
      attempts++;
      
      // 10초마다 진행 상황 로그
      if (attempts % 10 === 0) {
        console.log(`⏱️ [API] 대기 중... ${attempts}초 경과`);
      }
      
      const historyResponse = await fetch(`${COMFYUI_API_URL}/history/${promptId}`);
      const history = await historyResponse.json();

      if (history[promptId] && history[promptId].outputs) {
        const outputs = history[promptId].outputs;
        const imageNode = outputs["9"]; // SaveImage 노드
        
        if (imageNode && imageNode.images && imageNode.images.length > 0) {
          const image = imageNode.images[0];
          const imageUrl = `${COMFYUI_API_URL}/view?filename=${image.filename}&subfolder=${image.subfolder || ''}&type=${image.type}`;
          
          const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
          console.log(`✅ [API] 이미지 생성 완료! (${elapsedTime}초 소요)`);
          console.log(`🖼️ [API] 이미지 URL: ${imageUrl}`);
          
          const response: GenerateResponse & { promptId: string } = {
            imageUrl,
            promptId,
          };
          
          return NextResponse.json(response);
        }
      }
    }

    console.error(`❌ [API] 타임아웃: ${attempts}초 경과`);
    throw new Error('이미지 생성 시간 초과 (120초)');

  } catch (error) {
    console.error('Image generation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    
    // 연결 오류인 경우
    if (errorMessage.includes('fetch failed') || errorMessage.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { 
          error: 'ComfyUI 서버에 연결할 수 없습니다. ComfyUI가 http://localhost:8188에서 실행 중인지 확인해주세요.',
          details: errorMessage 
        },
        { status: 500 }
      );
    }
    
    // 기타 오류
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
