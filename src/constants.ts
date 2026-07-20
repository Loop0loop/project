import homeSnapshot from './data/broadcasts-home.json'
import liveSnapshot from './data/broadcasts-live.json'

export type BroadcastType = 'live' | 'home'

export type Broadcast = {
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
  rows: Broadcast[]
}

type LiveSnapshot = {
  collectedAt: string
  dataDate?: string
  live: BroadcastTable
}

type HomeSnapshot = {
  collectedAt: string
  dataDate?: string
  homeShopping: BroadcastTable
}

const live = liveSnapshot as LiveSnapshot
const home = homeSnapshot as HomeSnapshot
const dataDate = live.dataDate ?? live.collectedAt.slice(0, 10)

export const REFERENCE_DATE = `${dataDate.replaceAll('-', '.')} 방송 기준`
export const UNAVAILABLE_VALUE = '-'

export const BROADCAST_TABS: { value: BroadcastType; label: string }[] = [
  { value: 'live', label: '라이브 방송' },
  { value: 'home', label: '홈쇼핑' },
]

export const METRIC_LABEL: Record<BroadcastType, string> = {
  live: live.live.metricLabel,
  home: home.homeShopping.metricLabel,
}

export const BROADCASTS: Record<BroadcastType, Broadcast[]> = {
  live: live.live.rows,
  home: home.homeShopping.rows,
}
