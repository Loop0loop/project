// 기존 수집 파일의 날짜를 확인하기 위한 파일 읽기 모듈
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'

// 라이브 방송 데이터 날짜를 기준으로 전체 수집 필요 여부를 판단
const DATA_FILE = resolve('src/data/broadcasts-live.json')

// 날짜 비교는 한국 시간 기준으로 처리
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

// 오늘 수집한 데이터가 있으면 종료하고, 없거나 오래됐으면 collect 실행
async function main(): Promise<void> {
  const today = getKoreanDate()

  try {
    // 저장된 dataDate가 오늘과 같으면 중복 수집하지 않음
    const data = JSON.parse(await readFile(DATA_FILE, 'utf-8')) as { dataDate?: string }
    if (data.dataDate === today) {
      console.log(`이미 오늘(${today}) 데이터입니다. 수집을 생략합니다.`)
      return
    }
  } catch {
    console.log('기존 데이터가 없어 새로 수집합니다.')
  }

  // collect 스크립트를 자식 프로세스로 실행하고 성공/실패 결과를 기다림
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
