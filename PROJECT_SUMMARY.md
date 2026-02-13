# 프로젝트 요약

## 📁 프로젝트 구조

```
movie-style-generator/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # ComfyUI API 통신 로직
│   ├── globals.css               # 전역 스타일
│   ├── layout.tsx                # 루트 레이아웃
│   └── page.tsx                  # 메인 페이지 (클라이언트 컴포넌트)
│
├── components/
│   ├── ImageDisplay.tsx          # 생성된 이미지 표시 + 다운로드
│   ├── LoadingSpinner.tsx        # 로딩 애니메이션
│   └── MovieStyleCard.tsx        # 영화 스타일 선택 카드
│
├── constants/
│   └── movieStyles.ts            # 3가지 영화 스타일 프리셋
│
├── types/
│   └── index.ts                  # TypeScript 타입 정의
│
├── public/                       # 정적 파일
├── .env.local.example            # 환경 변수 예시
├── next.config.ts                # Next.js 설정 (이미지 도메인)
├── package.json                  # 프로젝트 의존성
├── tsconfig.json                 # TypeScript 설정
├── tailwind.config.ts            # Tailwind CSS 설정
├── README.md                     # 상세 문서
├── SETUP_GUIDE.md                # 빠른 시작 가이드
└── PROJECT_SUMMARY.md            # 이 파일
```

## 🎯 주요 파일 설명

### 1. `constants/movieStyles.ts`
3가지 영화 스타일 프리셋 정의:
- **Her**: 따뜻한 티얼/오렌지, 멜랑콜리
- **Blade Runner**: 사이버펑크 느와르, 네온
- **Grand Budapest Hotel**: 파스텔, 대칭, 웨스 앤더슨

### 2. `app/api/generate/route.ts`
- POST 요청 처리
- 사용자 입력 + 스타일 프리셋 결합
- ComfyUI 워크플로우 생성
- 이미지 생성 폴링 (최대 60초)
- 생성된 이미지 URL 반환

### 3. `app/page.tsx`
메인 UI 로직:
- 스타일 선택 상태 관리
- 사용자 입력 처리
- API 호출 및 로딩 상태
- 에러 처리
- 생성된 이미지 표시

### 4. `components/MovieStyleCard.tsx`
- 클릭 가능한 영화 스타일 카드
- 선택 상태 표시 (체크마크)
- 그라데이션 배경
- Hover 효과

### 5. `components/ImageDisplay.tsx`
- Next.js Image 컴포넌트 사용
- 로딩 상태 표시
- 다운로드 버튼 (Blob 방식)

### 6. `components/LoadingSpinner.tsx`
- 회전 애니메이션
- 로딩 메시지

## 🔄 데이터 흐름

```
사용자 입력
    ↓
[영화 스타일 선택] + [텍스트 입력]
    ↓
[생성하기 버튼 클릭]
    ↓
POST /api/generate
    ↓
{
  style: "her",
  userInput: "책 읽는 여자"
}
    ↓
최종 프롬프트 생성:
"책 읽는 여자, cinematic still from movie Her, warm teal..."
    ↓
ComfyUI API 호출
(http://localhost:8188/prompt)
    ↓
워크플로우 실행:
1. CheckpointLoader (SDXL 모델)
2. CLIPTextEncode (프롬프트)
3. EmptyLatentImage (1024x1024)
4. KSampler (이미지 생성)
5. VAEDecode
6. SaveImage
    ↓
폴링으로 완료 확인
(http://localhost:8188/history/{prompt_id})
    ↓
이미지 URL 반환
(http://localhost:8188/view?filename=...)
    ↓
프론트엔드에 표시
```

## 🎨 스타일링

- **Tailwind CSS 4.0** 사용
- **다크 모드** 기본
- **그라데이션 배경**: `from-gray-900 via-purple-900 to-gray-900`
- **반응형 그리드**: `grid-cols-1 md:grid-cols-3`
- **애니메이션**: `transition-all duration-300`
- **커스텀 스크롤바** 스타일링

## 🔧 기술적 특징

### TypeScript
- 엄격한 타입 체크
- 인터페이스 정의 (MovieStyle, GenerateRequest, GenerateResponse)

### Next.js 14 App Router
- 서버 컴포넌트 + 클라이언트 컴포넌트 분리
- API Routes (Route Handlers)
- Image 최적화

### 에러 처리
- try-catch 블록
- 사용자 친화적 에러 메시지
- 입력 검증

### 성능 최적화
- Next.js Image 컴포넌트 (자동 최적화)
- 조건부 렌더링
- 로딩 상태 관리

## 🚀 실행 방법

### 개발 환경
```bash
npm run dev
# http://localhost:3000
```

### 프로덕션 빌드
```bash
npm run build
npm start
```

### ComfyUI 실행 (필수)
```bash
cd ComfyUI
python main.py
# http://localhost:8188
```

## 📝 환경 요구사항

- **Node.js**: 18.17 이상
- **Python**: 3.10 이상
- **GPU**: NVIDIA (CUDA) 또는 Apple Silicon (MPS) 권장
- **디스크 공간**: 최소 10GB (모델 파일)
- **메모리**: 최소 8GB RAM

## 🎯 확장 가능성

### 쉬운 확장:
1. **새 영화 스타일 추가**: `constants/movieStyles.ts`에 객체 추가
2. **프롬프트 수정**: 각 스타일의 `prompt`/`negative` 수정
3. **UI 커스터마이징**: Tailwind 클래스 수정

### 고급 확장:
1. **다른 모델 사용**: `route.ts`의 `ckpt_name` 변경
2. **이미지 크기 조정**: workflow의 `width`/`height` 수정
3. **샘플링 설정**: `steps`, `cfg`, `sampler_name` 조정
4. **히스토리 기능**: 로컬 스토리지 또는 데이터베이스 추가

## 🐛 알려진 제한사항

1. **ComfyUI 의존성**: 로컬에서 ComfyUI가 실행되어야 함
2. **생성 시간**: GPU 성능에 따라 10-60초 소요
3. **동시 요청**: 한 번에 하나의 이미지만 생성 가능
4. **모델 크기**: SDXL 모델은 약 6.9GB

## 📚 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [ComfyUI GitHub](https://github.com/comfyanonymous/ComfyUI)
- [Stable Diffusion XL](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**프로젝트 완성! 🎉**
