# 크롤링 방식 변경
> commit Log : fix:storageState -> permanent browser - 영구 프로필으로 크롤링 수집 변경

- 변경 사항 : 초기에는 Playwright의 storageState로 로그인 쿠키를 user.json에 저장 및 재사용
- 기존 방법의 문제점 : 서비스 로그인 세션 제한 및 세션 토큰 갱신될 수 있어 저장된 수집할 때 로그인 만료 발생
- 수정 사항 : 인증 정보를 별도 json으로 복원하는 방식 대신 Playwright의 영구 브라우저 프로필로 변경

---

## 이전 방법

storageState를 사용하여 로그인 및 수집

``` ts
// 로그인
context.storageState({ path: 'playwright/.auth/user.json' })
```

``` ts
// 수집
browser.newContext({ storageState: '.../user.json' })
```

로그인 순간의 쿠키를 user.jso으로 복사해 다음 수집 때 불러와 사용


## 현재 방법
Playwright의 영구 브라우저  프로필로 변경
``` ts
chromium.launchPersistentContext('playwright/.profile', {
    headless: false,
})
```

auth:init과 collect 모두 같은 .profile 폴더를 브라우저 사용자 데이터 폴더로 사용<br>
로그인 쿠키,세션 개신 없이 브라우저 종류 시 자동 저장 다음 수집에서도 그대로 사용


# constants.ts 데이터 타입 구조 단순화

> Commit Log: feat:constants.ts Simplification - changeLog 업데이트

- 변경 사항 : 중간 변수를 제거하여 복잡성 최소화
- 기존 방법의 문제점 : `as LiveSnapshot`, `as HomeSnapshot` 타입 선언으로 중간 변수를 생성하는 작업의 복잡성 증가
- 수정 사항 : json 전체 구조 타입과 선언용 중간 변수를 제거 <br>
(컴포넌트 props에서 실제로 사용하는 `Broadcast`, `BroadcastType` 타입은 유지.)

---


## 이전 방법
``` ts
type BroadcastTable = {
  metricLabel: string
  rows: Broadcast[]
}

type LiveSnapshot = {
  collectedAt: string
  dataDate?: string
  live: BroadcastTable
}

type HomeSnapshot = {
  collectedAt: string
  dataDate?: string
  homeShopping: BroadcastTable
}

const live = liveSnapshot as LiveSnapshot
const home = homeSnapshot as HomeSnapshot
const dataDate = live.dataDate ?? live.collectedAt.slice(0, 10)
```

전의 방법은 현재의 프로젝트와 맞지않았음 이 프로젝트는 
1. zod 쓰지않음
2. 이후 확장할 계획이 없음

이러한 이유가 있어서 전의 방법은 오히려 복잡성을 증가할 뿐이엿음


## 현재 방법
``` ts
export const REFERENCE_DATE = `${dataDate.replaceAll('-', '.')} 방송 기준`
export const UNAVAILABLE_VALUE = '-'

export const BROADCAST_TABS: { value: BroadcastType; label: string }[] = [
  { value: 'live', label: '라이브 방송' },
  { value: 'home', label: '홈쇼핑' },
]

export const METRIC_LABEL: Record<BroadcastType, string> = {
  live: liveData.live.metricLabel,
  home: homeData.homeShopping.metricLabel,
}

export const BROADCASTS: Record<BroadcastType, Broadcast[]> = {
  live: liveData.live.rows,
  home: homeData.homeShopping.rows,
}
```
json import 데이터를  `liveData` , `homeData로` 직접 사용하고 타입 선언(as)을 위한 중간 변수를 제거함
