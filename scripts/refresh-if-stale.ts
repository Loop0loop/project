import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'

const DATA_FILE = resolve('src/data/broadcasts-live.json')

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

async function main(): Promise<void> {
  const today = getKoreanDate()

  try {
    const data = JSON.parse(await readFile(DATA_FILE, 'utf-8')) as { dataDate?: string }
    if (data.dataDate === today) {
      console.log(`이미 오늘(${today}) 데이터입니다. 수집을 생략합니다.`)
      return
    }
  } catch {
    console.log('기존 데이터가 없어 새로 수집합니다.')
  }

  await new Promise<void>((resolvePromise, rejectPromise) => {
    const child = spawn('pnpm', ['run', 'collect'], {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    child.on('error', rejectPromise)
    child.on('exit', (code) => (code === 0 ? resolvePromise() : rejectPromise(new Error(`수집 실패: ${code}`))))
  })
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
