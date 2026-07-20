import { METRIC_LABEL, UNAVAILABLE_VALUE, type Broadcast, type BroadcastType } from '../constants'

type BroadcastTableProps = {
  type: BroadcastType
  broadcasts: Broadcast[]
}

export function BroadcastTable({ type, broadcasts }: BroadcastTableProps) {
  return (
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
  )
}
