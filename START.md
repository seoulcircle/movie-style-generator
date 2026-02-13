# 🎬 영화 스타일 이미지 생성기 - 빠른 시작

## ✅ 체크리스트

시작하기 전에 다음을 확인하세요:

- [ ] Node.js 18.17 이상 설치됨
- [ ] Python 3.10 이상 설치됨
- [ ] ComfyUI 다운로드 완료
- [ ] Stable Diffusion XL 모델 다운로드 완료

---

## 🚀 1분 안에 시작하기

### 터미널 1: ComfyUI 실행

```bash
cd /path/to/ComfyUI
python main.py
```

**확인**: http://localhost:8188 에서 ComfyUI 웹 인터페이스가 열리는지 확인

---

### 터미널 2: Next.js 앱 실행

```bash
cd /Users/honglee/movie-style-generator
npm run dev
```

**확인**: http://localhost:3000 에서 앱이 열리는지 확인

---

## 🎨 사용 방법

1. **영화 스타일 선택** (Her, Blade Runner, Grand Budapest Hotel 중 하나)
2. **이미지 설명 입력** (예: "책 읽는 여자")
3. **생성하기 버튼 클릭**
4. **20-60초 대기** (GPU 성능에 따라 다름)
5. **결과 확인 및 다운로드**

---

## 📁 프로젝트 위치

```
/Users/honglee/movie-style-generator
```

---

## 📚 문서

- **README.md** - 전체 프로젝트 문서
- **SETUP_GUIDE.md** - 상세 설치 가이드
- **PROJECT_SUMMARY.md** - 기술 문서

---

## 🆘 문제 해결

### ComfyUI 연결 안 됨
```bash
# ComfyUI가 실행 중인지 확인
curl http://localhost:8188
```

### 포트 충돌
```bash
# Next.js를 다른 포트에서 실행
npm run dev -- -p 3001
```

### 모델 오류
```
ComfyUI/models/checkpoints/ 폴더에
sd_xl_base_1.0.safetensors 파일이 있는지 확인
```

---

## 🎯 예시 프롬프트

### Her 스타일
- "창밖을 바라보는 여자"
- "카페에서 노트북 하는 남자"
- "도시 야경"

### Blade Runner 스타일
- "비 내리는 거리"
- "네온사인 건물"
- "미래 도시의 밤"

### Grand Budapest Hotel 스타일
- "호텔 로비"
- "대칭적인 복도"
- "파스텔 톤의 방"

---

**즐거운 이미지 생성 되세요! 🎬✨**

문제가 있으면 README.md를 참고하세요.
