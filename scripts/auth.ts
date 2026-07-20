import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { stdin as input, stdout as output } from 'node:process'
import readline from 'node:readline/promises'
import { chromium } from 'playwright'

const AUTH_DIRECTORY = resolve('playwright/.auth')
const AUTH_FILE = resolve(AUTH_DIRECTORY, 'user.json')
const ASSIGNMENT_URL = 'https://live.ecomm-data.com/assignment?type=lb'

async function main(): Promise<void> {
  await mkdir(AUTH_DIRECTORY, { recursive: true })

  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext({
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
  })
  const page = await context.newPage()

  await page.goto(ASSIGNMENT_URL, { waitUntil: 'domcontentloaded' })

  const rl = readline.createInterface({ input, output })
  console.log('\n열린 브라우저에서 로그인한 뒤 실제 수치가 보이는지 확인하세요.\n')
  await rl.question('완료했으면 Enter를 누르세요: ')
  rl.close()

  await page.goto(ASSIGNMENT_URL, { waitUntil: 'domcontentloaded' })
  const firstRowText = await page.locator('table:visible tbody tr').first().innerText()

  if (firstRowText.includes('로그인') || firstRowText.includes('🔒')) {
    throw new Error('로그인 상태를 확인하지 못했습니다. 실제 수치가 보이는지 확인하세요.')
  }

  await context.storageState({ path: AUTH_FILE })
  await browser.close()
  console.log(`인증 상태 저장 완료: ${AUTH_FILE}`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
