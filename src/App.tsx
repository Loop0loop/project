import { useState } from 'react'

type Broadcast = {
  title: string
  platform: string
  category: string
  time: string
  products: number
}

const liveBroadcasts: Broadcast[] = ([
  ['오늘 단 하루! 최대 26%할인쿠폰+포인트 적립! 보니애가구 AI 라이브', '네이버쇼핑LIVE', '', '26.07.20 (월) 13:30', 64],
  ['세노비스 신상위크×헬시페스타 특집✨', '네이버쇼핑LIVE', '', '26.07.20 (월) 13:58', 49],
  ['[블루밍] 루볼 🎹디지털피아노 🥁전자드럼 여름방학 라이브 특가전!!', '네이버쇼핑LIVE', '', '26.07.20 (월) 14:00', 5],
  ['Live추가적립💚 LG가전으로 거실에서 주방까지🏠', '네이버쇼핑LIVE', '', '26.07.20 (월) 13:59', 38],
  ['Live적립🩷 LG휘센 오브제컬렉션 에어컨 라이브✨', '네이버쇼핑LIVE', '', '26.07.20 (월) 13:59', 6],
  ['👉 삼성 프린트기 컬러레이저 초특가 할인전!!', '네이버쇼핑LIVE', '', '26.07.20 (월) 12:59', 4],
  ['[AI라이브] 삼성전자 SSD 인기제품 특가 라이브!!', '네이버쇼핑LIVE', '', '26.07.20 (월) 13:59', 21],
  ['[AI라이브] 🔥 삼성 공식몰 7월 라이브! 식세기·인덕션 혜택 총집합', '네이버쇼핑LIVE', '', '26.07.20 (월) 12:59', 18],
  ['삼성 외장하드 특가 라이브✨고용량 슬림한 디자인', '네이버쇼핑LIVE', '', '26.07.20 (월) 13:58', 14],
  ['[LG전자 직영몰] 7월 여름맞이 생활가전 라이브 앵콜', '네이버쇼핑LIVE', '', '26.07.20 (월) 14:02', 32],
] as [string, string, string, string, number][]
).map(([title, platform, category, time, products]) => ({ title, platform, category, time, products }))

const homeShoppingBroadcasts: Broadcast[] = ([
  ['[26년]메밀골 동해막국수20세트+1세트 추가', '공영쇼핑', '식품', '26.07.20 (월) 13:40', 2],
  ['핸즈까사_냉감침구', 'KT알파쇼핑', '가구/인테리어', '26.07.20 (월) 13:39', 4],
  ['[CJ단독패키지] 녹는실 리프팅 앰플6박스', 'CJ온스타일 플러스', '화장품/미용', '26.07.20 (월) 13:45', 3],
  ['오한진알부민1', 'NS홈쇼핑 샵플러스', '식품', '26.07.20 (월) 13:41', 2],
  ['[폴앤조] ○ 26SS 퓨어 블룸 슬리브리스 3종 (레이스1+솔리드2)', '롯데원티비', '패션의류', '26.07.20 (월) 13:40', 3],
  ['덴프스 혈당케어 프로 12개월분+10일분 더', 'GS홈쇼핑 마이샵', '생활/건강', '26.07.20 (월) 13:57', 1],
  ['산지직송] 다온바다 왕특대사이즈 16미(미당 100g이상) 총 1.6kg이상', '홈앤쇼핑', '식품', '26.07.20 (월) 14:20', 3],
  ['[방송에서만 이가격] 바이아우어 맥주효모 탈모샴푸 4개 + 컨디셔너 1개', '현대홈쇼핑 플러스샵', '화장품/미용', '26.07.20 (월) 14:20', 2],
  ['[7월중마지막생방송] 락토핏 당케어프로 8+4개월+저당밥솥1대 ', '현대홈쇼핑', '식품', '26.07.20 (월) 14:25', 2],
  ['[1+1+1세트] 스타일리스 미니 에어젯 휴대용 선풍기', 'SK스토아', '디지털/가전', '26.07.20 (월) 14:31', 3],
] as [string, string, string, string, number][]
).map(([title, platform, category, time, products]) => ({ title, platform, category, time, products }))

function App() {
  const [type, setType] = useState<'live' | 'home'>('live')
  const broadcasts = type === 'live' ? liveBroadcasts : homeShoppingBroadcasts
  const metricLabel = type === 'live' ? '조회수' : '시청률'

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-16 text-slate-900 sm:px-8">
      <section className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold text-amber-600">라방바 데이터랩</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">라방 · 홈쇼핑 랭킹</h1>
            <p className="mt-2 text-sm text-slate-500">2026년 7월 20일 방송 기준</p>
          </div>
          <div className="flex rounded-lg bg-slate-200 p-1" role="tablist" aria-label="방송 유형">
            {[
              ['live', '라이브 방송'],
              ['home', '홈쇼핑'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={type === value}
                onClick={() => setType(value as 'live' | 'home')}
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
                <th className="w-14 px-5 py-4 text-center">순위</th>
                <th className="min-w-80 px-5 py-4">방송정보</th>
                <th className="w-36 px-5 py-4">분류</th>
                <th className="w-44 px-5 py-4">방송시간</th>
                <th className="w-24 px-5 py-4 text-center">{metricLabel}</th>
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
                  <td className="px-5 py-5 text-slate-500">{broadcast.category || '-'}</td>
                  <td className="px-5 py-5 text-slate-600">{broadcast.time}</td>
                  <td className="px-5 py-5 text-center text-slate-400">-</td>
                  <td className="px-5 py-5 text-center text-slate-400">-</td>
                  <td className="px-5 py-5 text-center text-slate-400">-</td>
                  <td className="px-5 py-5 text-center font-semibold text-slate-600">{broadcast.products}</td>
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
