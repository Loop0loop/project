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
