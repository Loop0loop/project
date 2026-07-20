import { access, constants, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium, type Locator, type Page } from 'playwright'

const BASE_URL = 'https://live.ecomm-data.com/assignment'
const PROFILE_PATH = resolve('playwright/.profile')
const LIVE_OUTPUT_PATH = resolve('src/data/broadcasts-live.json')
const HOME_OUTPUT_PATH = resolve('src/data/broadcasts-home.json')

type SourceType = 'lb' | 'hs'

type BroadcastRow = {
  rank: number
  title: string
  platform: string
  category: string
  broadcastTime: string
  audience: string
  salesCount: string
  salesAmount: string
  productCount: string
}

type BroadcastTable = {
  metricLabel: string
  rows: BroadcastRow[]
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

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

async function assertProfileExists(): Promise<void> {
  try {
    await access(PROFILE_PATH, constants.R_OK)
  } catch {
    throw new Error('인증 프로필이 없습니다. 먼저 pnpm run auth:init을 실행하세요.')
  }
}

async function getVisibleTable(page: Page): Promise<Locator> {
  const table = page.locator('table:visible').first()
  await table.waitFor({ state: 'visible', timeout: 30_000 })
  await table.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 30_000 })
  return table
}

async function collectTable(page: Page): Promise<BroadcastTable> {
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

    return {
      rank: Number(cleanText(cells[0])) || index + 1,
      title,
      platform,
      category: cleanText(cells[2]),
      broadcastTime: cleanText(cells[3]),
      audience: cleanText(cells[4]),
      salesCount: cleanText(cells[5]),
      salesAmount: cleanText(cells[6]),
      productCount: cleanText(cells[7]),
    }
  })

  if (JSON.stringify(rows).match(/로그인 후|🔒/)) {
    throw new Error('로그인 세션이 만료되었습니다. pnpm run auth:init을 다시 실행하세요.')
  }

  if (rows.length !== 10) {
    throw new Error(`10개를 기대했지만 ${rows.length}개가 수집됐습니다.`)
  }

  return { metricLabel: headers[4] || '조회수/시청률', rows }
}

async function collectType(page: Page, type: SourceType): Promise<BroadcastTable> {
  const url = new URL(BASE_URL)
  url.searchParams.set('type', type)
  url.searchParams.set('_', Date.now().toString())

  await page.goto(url.toString(), { waitUntil: 'domcontentloaded', timeout: 30_000 })
  return collectTable(page)
}

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
