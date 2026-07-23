/**
 * 브라우저의 상태 (LocalStroage , SessionStorage , Session Token)를 저장
 */

// aysnc , await , 절대경로를 받기위해 node import
import { resolve } from 'node:path'
import { stdin as input, stdout as output } from 'node:process'
import readline from 'node:readline/promises'
import { chromium } from 'playwright'

// 절대 경로 지정
const PROFILE_PATH = resolve('playwright/.profile')
// 세션 URL 지정 
const ASSIGNMENT_URL = 'https://live.ecomm-data.com/assignment?type=lb'

// 브라우저를 열고 로그인한 뒤, 인증 정보가 프로필 폴더에 저장되도록 처리
async function main(): Promise<void> {
  // 같은 프로필을 사용해야 collect 실행 시에도 로그인 세션을 재사용할 수 있음
  const context = await chromium.launchPersistentContext(PROFILE_PATH, {
    headless: false,
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
  })
  const page = context.pages()[0] ?? (await context.newPage())

  // 사용자가 브라우저에서 직접 로그인할 수 있도록 과제 페이지로 이동
  await page.goto(ASSIGNMENT_URL, { waitUntil: 'domcontentloaded' })

  const rl = readline.createInterface({ input, output })
  console.log('\n열린 브라우저에서 로그인한 뒤 실제 수치가 보이는지 확인하세요.\n')
  await rl.question('완료했으면 Enter를 누르세요: ')
  rl.close()

  // Enter 입력 후 페이지를 다시 확인해 실제 로그인 상태인지 검증
  await page.goto(ASSIGNMENT_URL, { waitUntil: 'domcontentloaded' })
  const firstRowText = await page.locator('table:visible tbody tr').first().innerText()

  if (firstRowText.includes('로그인') || firstRowText.includes('🔒')) {
    throw new Error('로그인 상태를 확인하지 못했습니다. 실제 수치가 보이는지 확인하세요.')
  }

  // 검증이 끝난 뒤 브라우저를 닫아 프로필 파일을 안전하게 저장
  await context.close()
  console.log(`인증 프로필 저장 완료: ${PROFILE_PATH}`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
