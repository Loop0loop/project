/**
 *  공통 상수 정의
 *  json 데이터 가져오기
 */


/**
 * 크로링 한 데이터 import
 */
import homeData from './data/broadcasts-home.json'
import liveData from './data/broadcasts-live.json'

// json 구조를 설명하는 TypeScript Type 정의
export type BroadcastType = 'live' | 'home'

/**
 * rows 배열 안에 들어가는 방송 한 건의 데이터 구조
 */
export type Broadcast = {
  rank: number
  title: string
  platform: string
  category: string
  broadcastTime: string
  audience?: string
  viewingRate?: string
  salesCount: string
  salesAmount: string
  productCount: string
}

/**
 * UI에 표시할 방송 기준 날짜
 * dataDate가 없을 시  collectedAt의 ISO 날짜 문자열 10글자를 (YYYY-MM-DD) 사용
 * 날자 데이터가 없을 시 오늘 날짜로 fallback 적용
 */
const today = new Date().toLocaleDateString("sv-SE")
const dataDate = liveData.dataDate 
?? (liveData.collectedAt ? liveData.collectedAt.slice(0,10) : today)

// - , . 제거하여 UI에 표시
export const REFERENCE_DATE = `${dataDate.replaceAll('-', '.')} 방송 기준`
// 방송 데이터 값이 없을 때 표시할 기본 문자
export const UNAVAILABLE_VALUE = '-'

// 탭 목록 데이터
export const BROADCAST_TABS: { value: BroadcastType; label: string }[] = [
  { value: 'live', label: '라이브 방송' },
  { value: 'home', label: '홈쇼핑' },
]

/**
 * 지표 라벨 매핑 객체
 * liveData , homeData의 json 구조가 달라 발생하는 런타임 에러 방지
 */
export const METRIC_LABEL: Record<BroadcastType, string> = {
  live: liveData.live.metricLabel,
  home: homeData.homeShopping.metricLabel,
}


/**
 * 방송 목록 배열 매핑 객체
 * UI components에서 탭 전환 시 조건문 없이 데이터 조회 가능
 */
export const BROADCASTS: Record<BroadcastType, Broadcast[]> = {
  live: liveData.live.rows,
  home: homeData.homeShopping.rows,
}
