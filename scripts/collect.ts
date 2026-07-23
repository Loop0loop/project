// 인증 프로필 확인과 수집 결과 JSON 저장을 위한 Node 파일 시스템 모듈
import { access, constants, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium, type Locator, type Page } from 'playwright'

// 수집할 원본 페이지와 인증/결과 파일의 절대 경로
const BASE_URL = 'https://live.ecomm-data.com/assignment'
const PROFILE_PATH = resolve('playwright/.profile')
const LIVE_OUTPUT_PATH = resolve('src/data/broadcasts-live.json')
const HOME_OUTPUT_PATH = resolve('src/data/broadcasts-home.json')

// lb: 라이브 방송, hs: 홈쇼핑 탭을 구분하는 쿼리 파라미터 값
type SourceType = 'lb' | 'hs'

// 표의 한 행을 앱에서 사용할 JSON 형태로 정리한 타입
type BroadcastRow = {
  rank: number
  title: string
  platform: string
  category: string
  broadcastTime: string
  audience: string
  viewingRate?: string
  salesCount: string
  salesAmount: string
  productCount: string
}

type BroadcastTable = {
  metricLabel: string
  rows: BroadcastRow[]
}

// 줄바꿈·연속 공백을 한 칸으로 바꿔 표 셀의 텍스트를 정리
function cleanText(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

// 수집 기준 날짜를 한국 시간(YYYY-MM-DD)으로 반환
function getKoreanDate(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return `${values.year}-${values.month}-${values.day}`
}

// auth:init으로 만든 로그인 프로필이 있는지 수집 전에 확인
async function assertProfileExists(): Promise<void> {
  try {
    await access(PROFILE_PATH, constants.R_OK)
  } catch {
    throw new Error('인증 프로필이 없습니다. 먼저 pnpm run auth:init을 실행하세요.')
  }
}

// 페이지에서 실제로 보이는 PC용 표와 첫 번째 데이터 행이 준비될 때까지 대기
async function getVisibleTable(page: Page): Promise<Locator> {
  const table = page.locator('table:visible').first()
  await table.waitFor({ state: 'visible', timeout: 30_000 })
  await table.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 30_000 })
  return table
}

// 화면의 상위 10개 행을 읽어 앱에서 사용하는 방송 데이터로 변환
async function collectTable(page: Page, type: SourceType): Promise<BroadcastTable> {
  const table = await getVisibleTable(page)
  const headers = (await table.locator('thead th').allInnerTexts()).map(cleanText)
  const cellsByRow = await table.locator('tbody tr').evaluateAll((rows) =>
    rows.slice(0, 10).map((row) =>
      Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim() ?? ''),
    ),
  )

  const rows = cellsByRow.map((cells, index): BroadcastRow => {
    if (cells.length < 8) {
      throw new Error(`${index + 1}번째 행의 셀 개수가 부족합니다: ${cells.length}`)
    }

    const [title = '', platform = ''] = cells[1].split('\n').map(cleanText).filter(Boolean)

    const metricValue = cleanText(cells[4])

    return {
      rank: Number(cleanText(cells[0])) || index + 1,
      title,
      platform,
      category: cleanText(cells[2]),
      broadcastTime: cleanText(cells[3]),
      // 라이브 방송은 조회수, 홈쇼핑은 시청률을 별도 필드로 보관한다.
      audience: type === 'lb' ? metricValue : '',
      ...(type === 'hs' ? { viewingRate: metricValue } : {}),
      salesCount: cleanText(cells[5]),
      salesAmount: cleanText(cells[6]),
      productCount: cleanText(cells[7]),
    }
  })

  // 잠긴 값이 섞였으면 만료된 로그인 세션으로 판단
  if (JSON.stringify(rows).match(/로그인 후|🔒/)) {
    throw new Error('로그인 세션이 만료되었습니다. pnpm run auth:init을 다시 실행하세요.')
  }

  if (rows.length !== 10) {
    throw new Error(`10개를 기대했지만 ${rows.length}개가 수집됐습니다.`)
  }

  return { metricLabel: headers[4] || '조회수/시청률', rows }
}

// 탭 종류별 URL로 이동한 뒤 해당 표를 수집
async function collectType(page: Page, type: SourceType): Promise<BroadcastTable> {
  const url = new URL(BASE_URL)
  url.searchParams.set('type', type)
  // 캐시된 결과 대신 최신 데이터를 받기 위한 캐시 무효화용 쿼리
  url.searchParams.set('_', Date.now().toString())

  await page.goto(url.toString(), { waitUntil: 'domcontentloaded', timeout: 30_000 })
  return collectTable(page, type)
}

// 로그인 세션으로 라이브·홈쇼핑 데이터를 모두 수집해 JSON 파일로 저장
async function main(): Promise<void> {
  await assertProfileExists()

  const context = await chromium.launchPersistentContext(PROFILE_PATH, {
    headless: false,
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
    extraHTTPHeaders: { 'cache-control': 'no-cache', pragma: 'no-cache' },
  })
  const page = context.pages()[0] ?? (await context.newPage())
  const live = await collectType(page, 'lb')
  const homeShopping = await collectType(page, 'hs')
  const collectedAt = new Date().toISOString()
  const dataDate = getKoreanDate()

  await mkdir(resolve('src/data'), { recursive: true })
  // 두 결과 파일을 동시에 저장
  await Promise.all([
    writeFile(LIVE_OUTPUT_PATH, JSON.stringify({ collectedAt, dataDate, live }, null, 2)),
    writeFile(HOME_OUTPUT_PATH, JSON.stringify({ collectedAt, dataDate, homeShopping }, null, 2)),
  ])
  await context.close()

  console.log(`라방·홈쇼핑 ${dataDate} 데이터 저장 완료`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
