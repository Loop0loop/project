import { useState } from 'react'
import { BroadcastTable } from './components/BroadcastTable'
import { BroadcastTabs } from './components/BroadcastTabs'
import { BROADCASTS, REFERENCE_DATE, type BroadcastType } from './constants'

function App() {
  const [type, setType] = useState<BroadcastType>('live')
  const broadcasts = BROADCASTS[type]

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-16 text-slate-900 sm:px-8">
      <section className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold text-amber-600">라방바 데이터랩</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">라방 · 홈쇼핑 랭킹</h1>
            <p className="mt-2 text-sm text-slate-500">{REFERENCE_DATE}</p>
          </div>
          <BroadcastTabs type={type} onChange={setType} />
        </div>

        <BroadcastTable type={type} broadcasts={broadcasts} />
      </section>
    </main>
  )
}

export default App
