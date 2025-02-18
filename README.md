# InterPersona

InterPersona는 개발자들의 이직 준비, 현업에서 면접 연습을 효율적으로 할 수 있도록 돕는 웹 앱입니다.

ChatGPT의 프롬프트를 활용하여 가상의 면접관과 모의 면접을 진행하고, 결과를 점수로 평가 받을 수 있습니다.
또한 녹음을 통해서 답변하여 실제 면접과 같은 경험을 제공합니다.

# Tech Stack

Next.js (v.14) | React (v.18) | TypeScript | Turborepo | Storybook | CSS Modules | MSW | Redux Toolkit | Redux-Saga | Tanstack Query | Zustand | Jest | React Testing Library

# Project Structure

```
├── apps
│   └── frontend
│       ├── public                     # 정적 파일(이미지, 폰트 등)
│       └── src
│           ├── _apis                  # API 호출 로직
│           ├── _components            # 레이아웃/페이지별 컴포넌트
│           │   ├── layout
│           │   └── pages
│           ├── _data                  # 데이터 관련 로직, react-query 훅
│           ├── _hooks                 # 커스텀 훅
│           ├── _mocks                 # Mock 데이터(테스트/개발 환경)
│           ├── _store                 # 프론트엔드 상태(Redux, Zustand)
│           ├── _storybook             # 프론트엔드 앱 전용 스토리북
│           ├── _tests                 # 프론트엔드 앱 전용 테스트
│           └── app                    # Next.js App Router 구조
│               ├── api
│               │   └── chat
│               │       └── route.ts   # STT API 프록시 라우트 등 서버 로직
│               ├── chat
│               │   ├── layout.tsx
│               │   ├── page.module.css
│               │   └── page.tsx       # 채팅(인터뷰) 페이지
│               ...
│               ├── layout.tsx
│               └── page.tsx
├── packages
│   ├── store                          # 전역 상태, Hooks 관리 (ex: useToastStore 등)
│   ├── eslint-config                  # 공통 ESLint 설정
│   ├── typescript-config              # 공통 TypeScript 설정
│   └── ui                             # 공통 UI 컴포넌트
│       └── src                       # 버튼, 모달 등 재사용 컴포넌트와 스토리북
│           └── style                 # 글로벌 스타일 테마
└── turbo.json                         # Turborepo 설정
```

# Flow Chart

## 유저 정보 입력

```mermaid
flowchart LR
    Start((앱 실행)) --> A[유저 정보 폼]
    A --> B[이메일 , 아이디 정보 입력]
    B --> C[로그인]
    C --> End((인터뷰어 조회))
```

## 인터뷰어 조회

```mermaid
flowchart LR
    Start((인터뷰어 조회 페이지)) --> A[인터뷰어 리스트 나열]
    A --> B[인터뷰어 MBTI/성향 확인]
    B --> C[인터뷰어 선택]
    C --> D((인터뷰))
```

## 인터뷰

### 인터뷰 전체

```mermaid
flowchart LR
    Start((인터뷰 페이지)) --> A{유저 정보, 인터뷰어 정보 확인}
    A --> |유저 정보 없음| B((유저 정보 입력))
    A --> |인터뷰어 정보 없음| C((인터뷰어 조회))
    A --> |유저, 인터뷰어 정보 확인| D[인터뷰어 인사말로 인터뷰 시작]
    D --> F((사용자 응답 표시))
    F --> G((인터뷰어 응답 표시))
    G --> H{대화가 20회 이상?}
    H --> |no| F((사용자 응답))
    H --> |yes| J[결과 페이지 버튼] --> End((결과 조회))
```

### 사용자 응답

```mermaid
flowchart LR
    Start((시작)) --> A((사용자 응답 - 녹음))
    A --> B[음성 파일을 STT로 텍스트 변환 요청]
    B -->|성공| C[채팅 메시지 전달]
    B -->|실패| D{재시도 횟수 3회 이상?}
    D -->|no| E[재시도 요청]
    D -->|yes| F[토스트 메시지로 새로고침 유도] --> G((인터뷰 페이지 새로고침))
    E --> |실패| D
    E --> |성공| C
    C --> H[음성/텍스트 메시지 표시]
    H --> End((사용자 응답 표시))
```

### 사용자 응답 - 녹음

```mermaid
flowchart LR
    Start((녹음 버튼 초기 상태)) --> A[녹음 버튼 클릭]
    A --> |권한 있음| B{녹음 시작 및 녹음 중 상태}
    B -->|권한 없음| C[Dialog를 통해 권한 요청]
    B --> D[음성 감지 시작]
    D -->|무음 감지| E[녹음 종료]
    E --> H[녹음된 음성 파일, WAV 생성] --> End((음성 파일 전달))
```

### 인터뷰어 응답

```mermaid
flowchart LR
    Start((시작)) --> A[AI 응답 요청]
    A --> |성공| End((AI 응답 표시))
    A --> |실패| C[재시도, 취소 버튼 표시]
    C --> |재시도| A[AI 응답 요청]
    C--> |취소| D((사용자 응답으로 복귀))
```

## 인터뷰 결과

```mermaid
flowchart LR
    Start((결과 페이지)) --> A[총평 표시]
    A --> B[세부 평가표시]
    B --> C[기술 이해도/문장 구성/커뮤니케이션 점수]
    C --> D{사용자 선택 버튼}
    D --> |다시 보기| E((인터뷰 페이지))
    D --> |인터뷰어 선택| F((인터뷰어 선택))
```

# [이슈(Wiki)](https://github.com/hmy751/inter-persona/wiki/Issue)

