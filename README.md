# 🎬 영화 스타일 이미지 생성기

> 🎨 영화의 미학을 담은 생성형 AI 이미지 생성 플랫폼

ComfyUI와 Stable Diffusion을 활용하여 영화의 시각적 스타일을 재현하는 AI 이미지 생성 웹 애플리케이션입니다. 
사용자가 입력한 텍스트 프롬프트를 Her, Harry Potter, Grand Budapest Hotel 등 유명 영화의 독특한 색감과 분위기로 변환하여 
고품질 이미지를 생성합니다.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🎥 데모

**[📹 데모 영상 보기](https://drive.google.com/file/d/1DFUrhYPgxG_pou8pYlutErt3WBCdh3xW/view)** *(2배속)*

실제 작동 화면과 이미지 생성 과정을 확인하세요.

> ⚠️ **로컬 전용 애플리케이션**  
> 이 프로젝트는 로컬 환경에서만 사용 가능합니다. ComfyUI가 localhost:8188에서 실행되어야 하며, 인터넷에 배포할 수 없습니다.

## ✨ 주요 기능

### 🎨 3가지 영화 스타일
- **Her (그녀)** - 따뜻하고 감성적인 파스텔 톤
- **Harry Potter (해리포터)** - 마법 같은 분위기의 어두운 아카데미아 스타일
- **Grand Budapest Hotel (그랜드 부다페스트 호텔)** - 대칭적이고 화려한 컬러

### 🔧 기술적 특징

#### 🌐 실시간 진행 상황 추적 (WebSocket)
- ComfyUI WebSocket 연결을 통한 실시간 이미지 생성 진행률 표시
- 자동 재연결 및 폴백 메커니즘
- 단계별 진행 상황 시각화 (노드 실행, 프롬프트 큐잉 등)
- WebSocket 실패 시에도 정상 작동 보장

#### 📥 이미지 다운로드
- 서버 사이드 프록시를 통한 CORS 문제 해결
- 원본 품질 유지 다운로드
- 자동 파일명 생성 (타임스탬프 기반)

#### 🎡 무한 스크롤 캐러셀
- 가상화된 무한 스크롤 구현으로 메모리 최적화
- 부드러운 스냅 스크롤 UX
- 선택된 카드 중앙 정렬
- 가시성 최적화 (보이는 카드만 렌더링)

#### ⚡ 성능 최적화
- Next.js 16 + Turbopack으로 빠른 개발 경험
- Image 컴포넌트를 활용한 자동 이미지 최적화
- 클라이언트 사이드 상태 관리 최적화
- 에러 바운더리 및 재시도 로직

#### 🎯 사용자 경험
- 반응형 디자인 (모바일/데스크톱 대응)
- 로딩 상태 피드백
- 에러 메시지 및 사용자 가이드
- 직관적인 인터페이스

## 📋 시스템 요구사항

- **Node.js** 18.17 이상
- **Python** 3.10 이상
- **ComfyUI** (최신 버전)
- **Stable Diffusion** 모델 (v1.5 또는 XL)

## 🛠️ 설치 방법

### 1. 저장소 클론

```bash
git clone <repository-url>
cd movie-style-generator
```

### 2. 의존성 설치

```bash
npm install
```

### 3. ComfyUI 설정

1. [ComfyUI](https://github.com/comfyanonymous/ComfyUI) 다운로드 및 설치
2. Stable Diffusion 모델 다운로드:
   - [SD v1.5](https://huggingface.co/runwayml/stable-diffusion-v1-5) 또는
   - [SDXL Base 1.0](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0)
3. 모델을 `ComfyUI/models/checkpoints/` 폴더에 저장

## 🚀 실행 방법

### 터미널 1: ComfyUI 서버 시작

```bash
cd /path/to/ComfyUI
python main.py
```

ComfyUI가 http://localhost:8188 에서 실행됩니다.

### 터미널 2: Next.js 개발 서버 시작

```bash
npm run dev
```

웹 앱이 http://localhost:3000 에서 실행됩니다.

## 📖 사용 방법

1. **영화 스타일 선택**: 원하는 영화 스타일 카드를 클릭
2. **이미지 설명 입력**: 생성하고 싶은 이미지를 텍스트로 설명
3. **생성하기 클릭**: 버튼을 눌러 이미지 생성 시작
4. **결과 확인**: 20-60초 후 생성된 이미지 확인
5. **다운로드**: 이미지를 클릭하거나 다운로드 버튼 사용

### 예시 프롬프트
영어로 쓰는 것이 더 정확합니다
예시) a girl reading a book /

## 🏗️ 프로젝트 구조

```
movie-style-generator/
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts          # ComfyUI API 통합 & 이미지 생성
│   │   └── download/
│   │       └── route.ts          # 이미지 다운로드 프록시
│   ├── globals.css               # 글로벌 스타일
│   ├── layout.tsx                # 레이아웃 컴포넌트
│   └── page.tsx                  # 메인 페이지 (무한 캐러셀)
├── components/
│   ├── ImageDisplay.tsx          # 이미지 표시 & 다운로드
│   ├── LoadingSpinner.tsx        # 로딩 애니메이션
│   ├── MovieStyleCard.tsx        # 영화 스타일 카드
│   ├── ProgressBar.tsx           # WebSocket 진행률 표시
│   └── DetailedLoadingStatus.tsx # 상세 로딩 상태
├── hooks/
│   └── useComfyUI.ts             # ComfyUI WebSocket 연결 훅
├── constants/
│   └── movieStyles.ts            # 영화 스타일 정의
├── types/
│   └── index.ts                  # TypeScript 타입 정의
└── package.json
```

## 🎨 기술 스택

### Frontend
- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.0
- **Image Optimization**: Next.js Image Component

### Backend & AI
- **AI Engine**: ComfyUI + Stable Diffusion
- **API**: Next.js API Routes (Route Handlers)
- **Real-time Communication**: WebSocket
- **Image Processing**: Server-side Proxy

### Architecture
- **상태 관리**: React Hooks (useState, useEffect, useRef)
- **실시간 통신**: WebSocket (ComfyUI 서버)
- **API 구조**: RESTful API + WebSocket
- **렌더링**: Client-side Rendering (CSR)

## ⚙️ 설정

### 모델 변경

`app/api/generate/route.ts` 파일에서 사용할 모델을 변경할 수 있습니다:

```typescript
"ckpt_name": "v1-5-pruned-emaonly.safetensors"  // 여기를 수정
```

### 이미지 크기 조정

```typescript
"5": {
  "inputs": {
    "width": 512,   // 원하는 너비
    "height": 512,  // 원하는 높이
    "batch_size": 1
  },
  "class_type": "EmptyLatentImage"
}
```

### 생성 단계 조정

```typescript
"3": {
  "inputs": {
    "steps": 20,    // 증가시키면 품질 향상 (시간 증가)
    "cfg": 7,       // CFG 스케일 (7-12 권장)
    ...
  }
}
```


## 📊 성능

- **이미지 생성 시간**: 20-60초 (GPU 성능에 따라 다름)
- **메모리 사용**: 약 4-8GB (모델에 따라 다름)
- **권장 GPU**: NVIDIA RTX 3060 이상 또는 Apple Silicon M1 이상

## 📄 라이선스

MIT License


## 📧 문의

프로젝트에 대한 질문이나 제안이 있으시면 이슈를 열어주세요.

---

*Made with ❤️ using Next.js & ComfyUI*
