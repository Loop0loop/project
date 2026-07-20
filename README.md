# 라방바 데이터랩 방송 리스트

라방과 홈쇼핑 방송 목록을 전환해 볼 수 있는 React + Tailwind CSS 페이지입니다. 화면은 저장된 JSON 스냅샷으로 실행되므로 로그인 없이 바로 확인할 수 있습니다.

npm 사용 방법은 [README.npm.md](README.npm.md.md)를 참고하세요.

## 요구 사항

- Node.js 20 이상 (Node.js 22.23.0에서 확인)
- pnpm 11 이상



## 실행 방법

```bash
git clone https://github.com/Loop0loop/project.git
cd project
pnpm install
pnpm dev
```


브라우저에서 출력된 로컬 주소를 열면 됩니다.

## 데이터 갱신

현재 수집된 JSON이 저장소에 포함되어 있으므로 평소에는 이 과정을 실행할 필요가 없습니다. 새 데이터를 수집할 때만 사용합니다.

### 1. Playwright Chromium 설치

최초 수집 전에는 Chromium도 별도로 설치해야 합니다.

```bash
pnpm exec playwright install chromium
```

Linux 환경에서 브라우저 의존성 설치가 추가로 필요하면 아래 명령을 사용합니다.

```bash
pnpm exec playwright install --with-deps chromium
```

### 2. 최초 로그인

최초 한 번만 브라우저에서 로그인해 영구 프로필에 인증 상태를 저장합니다. 이 프로필은 Git에서 제외됩니다.

```bash
pnpm auth:init
```

### 3. 수집

이후에는 로그인 창 없이 현재 날짜의 라방·홈쇼핑 데이터를 수집합니다.

```bash
pnpm collect
```

`auth:init`과 `collect`는 동시에 실행하지 마세요. 동일한 영구 브라우저 프로필을 사용합니다.

오늘 데이터가 이미 있으면 수집을 생략하려면 다음 명령을 사용합니다.

```bash
pnpm refresh
pnpm dev:fresh
```


## 검증

```bash
pnpm build
pnpm lint
```
