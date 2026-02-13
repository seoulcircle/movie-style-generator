# API 문서

## API 엔드포인트

### POST /api/generate

영화 스타일로 이미지를 생성합니다.

#### 요청 (Request)

**URL**: `/api/generate`

**Method**: `POST`

**Content-Type**: `application/json`

**Body**:

```json
{
  "style": "her" | "blade-runner" | "grand-budapest-hotel",
  "userInput": "책 읽는 여자"
}
```

**필드 설명**:

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| style | string | Yes | 영화 스타일 ID (her, blade-runner, grand-budapest-hotel) |
| userInput | string | Yes | 생성할 이미지 설명 |

#### 응답 (Response)

**성공 응답** (200 OK):

```json
{
  "imageUrl": "http://localhost:8188/view?filename=ComfyUI_00001_.png&subfolder=&type=output"
}
```

**에러 응답** (400 Bad Request):

```json
{
  "error": "스타일과 입력 텍스트를 모두 제공해야 합니다."
}
```

**에러 응답** (500 Internal Server Error):

```json
{
  "error": "ComfyUI 서버에 연결할 수 없습니다. ComfyUI가 실행 중인지 확인해주세요.",
  "details": "상세 에러 메시지"
}
```

#### 예시

**cURL 예시**:

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "style": "her",
    "userInput": "책 읽는 여자"
  }'
```

**JavaScript (fetch) 예시**:

```javascript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    style: 'her',
    userInput: '책 읽는 여자',
  }),
});

const data = await response.json();
console.log(data.imageUrl);
```

---

## ComfyUI API

이 프로젝트는 내부적으로 ComfyUI API를 사용합니다.

### ComfyUI 엔드포인트

#### POST /prompt

워크플로우를 실행하여 이미지를 생성합니다.

**URL**: `http://localhost:8188/prompt`

**Body**:

```json
{
  "prompt": {
    // 워크플로우 정의 (노드 그래프)
  },
  "client_id": "unique-client-id"
}
```

#### GET /history/{prompt_id}

프롬프트 실행 결과를 조회합니다.

**URL**: `http://localhost:8188/history/{prompt_id}`

**응답**:

```json
{
  "prompt_id": {
    "prompt": [...],
    "outputs": {
      "9": {
        "images": [
          {
            "filename": "ComfyUI_00001_.png",
            "subfolder": "",
            "type": "output"
          }
        ]
      }
    }
  }
}
```

#### GET /view

생성된 이미지를 가져옵니다.

**URL**: `http://localhost:8188/view?filename={name}&subfolder={subfolder}&type={type}`

**응답**: 이미지 파일 (바이너리)

---

## 워크플로우 구조

```javascript
{
  "3": {  // KSampler - 이미지 생성
    "inputs": {
      "seed": 랜덤 시드,
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
  "4": {  // CheckpointLoader - 모델 로드
    "inputs": {
      "ckpt_name": "sd_xl_base_1.0.safetensors"
    },
    "class_type": "CheckpointLoaderSimple"
  },
  "5": {  // EmptyLatentImage - 빈 이미지
    "inputs": {
      "width": 1024,
      "height": 1024,
      "batch_size": 1
    },
    "class_type": "EmptyLatentImage"
  },
  "6": {  // CLIPTextEncode - 포지티브 프롬프트
    "inputs": {
      "text": "최종 프롬프트",
      "clip": ["4", 1]
    },
    "class_type": "CLIPTextEncode"
  },
  "7": {  // CLIPTextEncode - 네거티브 프롬프트
    "inputs": {
      "text": "네거티브 프롬프트",
      "clip": ["4", 1]
    },
    "class_type": "CLIPTextEncode"
  },
  "8": {  // VAEDecode - 디코딩
    "inputs": {
      "samples": ["3", 0],
      "vae": ["4", 2]
    },
    "class_type": "VAEDecode"
  },
  "9": {  // SaveImage - 이미지 저장
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": ["8", 0]
    },
    "class_type": "SaveImage"
  }
}
```

---

## 타입 정의

### TypeScript 인터페이스

```typescript
// 영화 스타일
export interface MovieStyle {
  id: string;
  name: string;
  description: string;
  prompt: string;
  negative: string;
  color: string;
}

// 생성 요청
export interface GenerateRequest {
  style: string;
  userInput: string;
}

// 생성 응답
export interface GenerateResponse {
  imageUrl: string;
}
```

---

## 에러 코드

| 상태 코드 | 설명 |
|-----------|------|
| 200 | 성공 |
| 400 | 잘못된 요청 (필수 필드 누락, 유효하지 않은 스타일) |
| 500 | 서버 오류 (ComfyUI 연결 실패, 타임아웃) |

---

## 제한사항

- **타임아웃**: 이미지 생성은 최대 60초 대기
- **동시 요청**: 현재 동시 요청 처리 미지원
- **파일 크기**: 생성된 이미지는 약 1-5MB
- **이미지 크기**: 1024x1024 고정

---

## 향후 개선 사항

- [ ] 동시 요청 큐잉 시스템
- [ ] 이미지 크기 커스터마이징
- [ ] 프리뷰 이미지 생성 (저해상도)
- [ ] WebSocket을 통한 실시간 진행 상황
- [ ] 이미지 히스토리 저장
