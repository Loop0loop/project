# 라방바 데이터랩 방송 리스트

라방과 홈쇼핑 방송 목록을 전환해 볼 수 있는 React + Tailwind CSS 페이지입니다. 화면은 저장된 JSON 스냅샷으로 실행되므로 로그인 없이 바로 확인할 수 있습니다.

## 실행 방법

```bash
pnpm install
pnpm dev
```

브라우저에서 출력된 로컬 주소를 열면 됩니다.

## 데이터 갱신

최초 한 번만 브라우저에서 로그인해 인증 상태를 저장합니다. 인증 파일은 Git에서 제외됩니다.

```bash
pnpm auth:init
```

이후에는 로그인 창 없이 현재 날짜의 라방·홈쇼핑 데이터를 수집합니다.

```bash
pnpm collect
```

오늘 데이터가 이미 있으면 수집을 생략하려면 다음 명령을 사용합니다.

```bash
pnpm refresh
pnpm dev:fresh
```

세션이 만료되면 `pnpm auth:init`을 다시 실행하면 됩니다.

## 검증

```bash
pnpm build
pnpm lint
```
