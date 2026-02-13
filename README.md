# 🎬 영화 스타일 이미지 생성기

ComfyUI와 Stable Diffusion을 활용한 AI 이미지 생성 웹 애플리케이션입니다.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ 주요 기능

### 🎨 3가지 영화 스타일
- **Her (그녀)** - 따뜻하고 감성적인 파스텔 톤
- **Blade Runner (블레이드 러너)** - 사이버펑크 네온 스타일
- **Grand Budapest Hotel (그랜드 부다페스트 호텔)** - 대칭적이고 화려한 컬러

### 💫 현대적인 UI/UX
- Toss Impact 디자인 시스템 영감
- 부드러운 애니메이션과 그라데이션
- 반응형 디자인 (모바일, 태블릿, 데스크톱)
- 실시간 진행 상황 표시 (WebSocket 지원)

### 🚀 최적화된 성능
- Next.js 16 + Turbopack
- 실시간 이미지 생성 상태 추적
- 자동 이미지 다운로드 기능
- 에러 핸들링 및 재시도 로직

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

**Her 스타일:**
- "창밖을 바라보는 여자"
- "카페에서 노트북 하는 남자"
- "도시의 석양"

**Blade Runner 스타일:**
- "비 내리는 거리"
- "네온사인 건물"
- "미래 도시의 밤"

**Grand Budapest Hotel 스타일:**
- "호텔 로비"
- "대칭적인 복도"
- "파스텔 톤의 방"

## 🏗️ 프로젝트 구조

```
movie-style-generator/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # ComfyUI API 통합
│   ├── globals.css               # 글로벌 스타일
│   ├── layout.tsx                # 레이아웃 컴포넌트
│   └── page.tsx                  # 메인 페이지
├── components/
│   ├── ImageDisplay.tsx          # 이미지 표시 컴포넌트
│   ├── LoadingSpinner.tsx        # 로딩 애니메이션
│   ├── MovieStyleCard.tsx        # 스타일 카드
│   └── ProgressBar.tsx           # 진행률 표시
├── hooks/
│   └── useComfyUI.ts             # ComfyUI WebSocket 훅
├── constants/
│   └── movieStyles.ts            # 영화 스타일 정의
├── types/
│   └── index.ts                  # TypeScript 타입 정의
└── package.json
```

## 🎨 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4.0
- **AI Backend**: ComfyUI, Stable Diffusion
- **Real-time**: WebSocket (선택적)

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

## 🐛 문제 해결

### ComfyUI 연결 안 됨

```bash
# ComfyUI가 실행 중인지 확인
curl http://localhost:8188
```

### 포트 충돌

```bash
# 다른 포트에서 Next.js 실행
npm run dev -- -p 3001
```

### 모델 오류

ComfyUI의 `models/checkpoints/` 폴더에 올바른 모델 파일이 있는지 확인하세요.

### WebSocket 연결 실패

WebSocket은 선택적 기능입니다. 연결이 실패해도 앱은 정상적으로 작동하며, 진행 상황 표시만 제한됩니다.

## 📊 성능

- **이미지 생성 시간**: 20-60초 (GPU 성능에 따라 다름)
- **메모리 사용**: 약 4-8GB (모델에 따라 다름)
- **권장 GPU**: NVIDIA RTX 3060 이상 또는 Apple Silicon M1 이상

## 🔮 향후 계획

- [ ] 더 많은 영화 스타일 추가
- [ ] 이미지 편집 기능
- [ ] 배치 생성 기능
- [ ] 스타일 믹싱
- [ ] 사용자 커스텀 프롬프트 템플릿
- [ ] 이미지 갤러리 및 히스토리

## 📄 라이선스

MIT License

## 🤝 기여

이슈와 PR은 언제나 환영합니다!

## 📧 문의

프로젝트에 대한 질문이나 제안이 있으시면 이슈를 열어주세요.

---

**Made with ❤️ using Next.js and ComfyUI**
