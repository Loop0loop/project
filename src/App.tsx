import { useState } from 'react'
import {
  BROADCASTS,
  BROADCAST_TABS,
  METRIC_LABEL,
  REFERENCE_DATE,
  UNAVAILABLE_VALUE,
  type BroadcastType,
} from './constants'

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
          <div className="flex rounded-lg bg-slate-200 p-1" role="tablist" aria-label="방송 유형">
            {BROADCAST_TABS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={type === value}
                onClick={() => setType(value)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${type === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-[960px] w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
              <tr>
                <th className="min-w-16 whitespace-nowrap px-5 py-4 text-center">순위</th>
                <th className="min-w-80 px-5 py-4">방송정보</th>
                <th className="w-36 px-5 py-4">분류</th>
                <th className="w-44 px-5 py-4">방송시간</th>
                <th className="w-24 px-5 py-4 text-center">{METRIC_LABEL[type]}</th>
                <th className="w-24 px-5 py-4 text-center">판매량</th>
                <th className="w-24 px-5 py-4 text-center">매출액</th>
                <th className="w-20 px-5 py-4 text-center">상품수</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {broadcasts.map((broadcast, index) => (
                <tr key={broadcast.title} className="hover:bg-slate-50">
                  <td className="px-5 py-5 text-center font-semibold text-slate-500">{index + 1}</td>
                  <td className="px-5 py-5">
                    <p className="line-clamp-1 font-semibold text-slate-800">{broadcast.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{broadcast.platform}</p>
                  </td>
                  <td className="px-5 py-5 text-slate-500">{broadcast.category || UNAVAILABLE_VALUE}</td>
                  <td className="px-5 py-5 text-slate-600">{broadcast.broadcastTime}</td>
                  <td className="px-5 py-5 text-center text-slate-400">{broadcast.audience || UNAVAILABLE_VALUE}</td>
                  <td className="px-5 py-5 text-center text-slate-400">{broadcast.salesCount || UNAVAILABLE_VALUE}</td>
                  <td className="px-5 py-5 text-center text-slate-400">{broadcast.salesAmount || UNAVAILABLE_VALUE}</td>
                  <td className="px-5 py-5 text-center font-semibold text-slate-600">{broadcast.productCount || UNAVAILABLE_VALUE}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default App
