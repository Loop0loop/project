/**
 * 방송 목록 Table components
 * 전달받은 방송 타입과 방송 목록을 바탕으로 표 렌더링
 */

// 상수 import
import { METRIC_LABEL, UNAVAILABLE_VALUE, type Broadcast, type BroadcastType } from '../constants'


type BroadcastTableProps = {
  type: BroadcastType
  broadcasts: Broadcast[]
}

export function BroadcastTable({ type, broadcasts }: BroadcastTableProps) {
  return (
    <section className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-[960px] w-full text-left text-sm">
        {/** 테이블 헤더 영역*/}
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
        {/** 테이블 헤더 영역*/}
        <tbody className="divide-y divide-slate-100">
          {broadcasts.map((broadcast, index) => (
            <tr key={broadcast.rank} className="hover:bg-slate-50">
              <td className="px-5 py-5 text-center font-semibold text-slate-500">{index + 1}</td>
              <td className="px-5 py-5">
                <p className="line-clamp-1 font-semibold text-slate-800">{broadcast.title}</p>
                {/* platfrom 값이 json에 다 비어있어 삭제 
                <p className="mt-1 text-xs text-slate-400">{broadcast.platform}</p>
                */}
              </td>
              <td className="px-5 py-5 text-slate-500">{broadcast.category || UNAVAILABLE_VALUE}</td>
              <td className="px-5 py-5 text-slate-600">{broadcast.broadcastTime}</td>
              <td className="px-5 py-5 text-center text-slate-400">
                {/** 홈쇼핑 시청률 없을 시 svg로 변환 */}
                {type === 'home' && !broadcast.viewingRate ? (
                  <img
                    src="https://live.ecomm-data.com/__modules/NoData/preparing.svg"
                    alt="시청률 집계 중"
                    width={16}
                    height={16}
                    className="mx-auto"
                  />
                ) : (
                  (type === 'home' ? broadcast.viewingRate : broadcast.audience) || UNAVAILABLE_VALUE
                )}
              </td>
              <td className="px-5 py-5 text-center text-slate-400">{broadcast.salesCount || UNAVAILABLE_VALUE}</td>
              <td className="px-5 py-5 text-center text-slate-400">{broadcast.salesAmount || UNAVAILABLE_VALUE}</td>
              <td className="px-5 py-5 text-center font-semibold text-slate-600">{broadcast.productCount || UNAVAILABLE_VALUE}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
