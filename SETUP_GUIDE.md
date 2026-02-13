# 🚀 빠른 시작 가이드

## 1단계: ComfyUI 설치 및 실행

### ComfyUI 설치

```bash
# 1. ComfyUI 저장소 클론
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# 2. Python 가상환경 생성 (권장)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. 의존성 설치
pip install -r requirements.txt
```

### Stable Diffusion XL 모델 다운로드

1. [Hugging Face - SDXL Base 1.0](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/tree/main) 방문
2. `sd_xl_base_1.0.safetensors` 파일 다운로드 (약 6.9GB)
3. `ComfyUI/models/checkpoints/` 폴더에 저장

### ComfyUI 실행

```bash
# ComfyUI 디렉토리에서
python main.py

# GPU 사용 (NVIDIA)
python main.py --cuda-device 0

# Mac M1/M2/M3 (MPS)
python main.py --force-fp16
```

✅ 성공하면 `http://localhost:8188` 에서 ComfyUI 웹 인터페이스가 열립니다.

---

## 2단계: Next.js 프로젝트 실행

```bash
# 프로젝트 디렉토리로 이동
cd movie-style-generator

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

✅ 브라우저에서 `http://localhost:3000` 을 열어 앱을 확인하세요!

---

## 📝 사용 예시

### 예시 프롬프트:

**Her 스타일:**
- "책 읽는 여자"
- "창밖을 바라보는 남자"
- "도시 풍경"

**Blade Runner 스타일:**
- "비 내리는 거리를 걷는 사람"
- "네온사인이 있는 건물"
- "미래 도시의 밤"

**Grand Budapest Hotel 스타일:**
- "호텔 로비"
- "엘리베이터 안의 사람"
- "대칭적인 복도"

---

## ⚠️ 문제 해결

### "ComfyUI 서버에 연결할 수 없습니다"

**해결 방법:**
1. ComfyUI가 실행 중인지 확인
2. 터미널에서 `http://localhost:8188` 접속 확인
3. 방화벽 설정 확인

### 이미지 생성이 너무 느림

**해결 방법:**
1. GPU 드라이버 최신 버전 확인
2. CUDA/MPS 활성화 확인
3. 더 작은 이미지 크기 사용 (workflow 수정)

### 모델 파일을 찾을 수 없음

**해결 방법:**
1. `ComfyUI/models/checkpoints/` 경로 확인
2. 파일명이 `sd_xl_base_1.0.safetensors` 인지 확인
3. 파일 크기가 약 6.9GB인지 확인

---

## 🎯 다음 단계

- 다른 Stable Diffusion 모델 시도
- 커스텀 영화 스타일 추가
- 이미지 크기 및 품질 설정 조정
- 생성 히스토리 기능 추가

---

**즐거운 이미지 생성 되세요! 🎬✨**
