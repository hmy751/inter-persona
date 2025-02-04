# InterPersona

InterPersona는 개발자들의 이직 준비, 현업에서 면접 연습을 효율적으로 할 수 있도록 돕는 웹 앱입니다.
ChatGPT의 프롬프트를 활용하여 가상의 면접관과 모의 면접을 진행하고, 결과를 점수로 평가 받을 수 있습니다.
또한 녹음을 통해서 답변하여 실제 면접과 같은 경험을 제공합니다.

## Tech Stack

Next.js (v.14) | React (v.18) | TypeScript | Turborepo | Storybook | CSS Modules | MSW | Redux Toolkit | Redux-Saga | Zustand | Jest | React Testing Library

## 상태관리

- Redux Toolkit, Redux-Saga: 채팅 기능 전용 상태관리로, 채팅 로직의 일정한 흐름의 안정성을 위해 적용
- Zustand: 전역에서 사용되는 상태 관리를 위해 적용

## UI

- 모노레포 프로젝트 구조로, @repo/ui 패키지로 분리하여 공통 컴포넌트 및 global style을 구성
- Storybook으로 repo/ui와 apps/frontend의 스타일링을 확인할 수 있도록 구성
- module css를 통해 Next JS의 서버 컴포넌트에 적합하도록 구성

## Build System

- 터보레포를 활용하여, 프로젝트를 여러 패키지 형태로 나누는 모노레포로 구성

## Test Tool

- React-testing-library, Jest를 통해 주요 로직의 테스트를 작성
- MSW를 통해 통신 테스트 모킹에 활용

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

## 면접관 결과

```mermaid
flowchart LR
    Start((결과 페이지)) --> A[총평 표시]
    A --> B[세부 평가표시]
    B --> C[기술 이해도/문장 구성/커뮤니케이션 점수]
    C --> D{사용자 선택 버튼}
    D --> |다시 보기| E((인터뷰 페이지))
    D --> |인터뷰어 선택| F((인터뷰어 선택))
```
