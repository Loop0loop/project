export type BroadcastType = 'live' | 'home'

export type Broadcast = {
  title: string
  platform: string
  category: string
  time: string
  products: number
}

export const REFERENCE_DATE = '2026년 7월 20일 방송 기준'
export const UNAVAILABLE_VALUE = '-'

export const BROADCAST_TABS: { value: BroadcastType; label: string }[] = [
  { value: 'live', label: '라이브 방송' },
  { value: 'home', label: '홈쇼핑' },
]

export const METRIC_LABEL: Record<BroadcastType, string> = {
  live: '조회수',
  home: '시청률',
}

export const BROADCASTS: Record<BroadcastType, Broadcast[]> = {
  live: [
    { title: '오늘 단 하루! 최대 26%할인쿠폰+포인트 적립! 보니애가구 AI 라이브', platform: '네이버쇼핑LIVE', category: '', time: '26.07.20 (월) 13:30', products: 64 },
    { title: '세노비스 신상위크×헬시페스타 특집✨', platform: '네이버쇼핑LIVE', category: '', time: '26.07.20 (월) 13:58', products: 49 },
    { title: '[블루밍] 루볼 🎹디지털피아노 🥁전자드럼 여름방학 라이브 특가전!!', platform: '네이버쇼핑LIVE', category: '', time: '26.07.20 (월) 14:00', products: 5 },
    { title: 'Live추가적립💚 LG가전으로 거실에서 주방까지🏠', platform: '네이버쇼핑LIVE', category: '', time: '26.07.20 (월) 13:59', products: 38 },
    { title: 'Live적립🩷 LG휘센 오브제컬렉션 에어컨 라이브✨', platform: '네이버쇼핑LIVE', category: '', time: '26.07.20 (월) 13:59', products: 6 },
    { title: '👉 삼성 프린트기 컬러레이저 초특가 할인전!!', platform: '네이버쇼핑LIVE', category: '', time: '26.07.20 (월) 12:59', products: 4 },
    { title: '[AI라이브] 삼성전자 SSD 인기제품 특가 라이브!!', platform: '네이버쇼핑LIVE', category: '', time: '26.07.20 (월) 13:59', products: 21 },
    { title: '[AI라이브] 🔥 삼성 공식몰 7월 라이브! 식세기·인덕션 혜택 총집합', platform: '네이버쇼핑LIVE', category: '', time: '26.07.20 (월) 12:59', products: 18 },
    { title: '삼성 외장하드 특가 라이브✨고용량 슬림한 디자인', platform: '네이버쇼핑LIVE', category: '', time: '26.07.20 (월) 13:58', products: 14 },
    { title: '[LG전자 직영몰] 7월 여름맞이 생활가전 라이브 앵콜', platform: '네이버쇼핑LIVE', category: '', time: '26.07.20 (월) 14:02', products: 32 },
  ],
  home: [
    { title: '[26년]메밀골 동해막국수20세트+1세트 추가', platform: '공영쇼핑', category: '식품', time: '26.07.20 (월) 13:40', products: 2 },
    { title: '핸즈까사_냉감침구', platform: 'KT알파쇼핑', category: '가구/인테리어', time: '26.07.20 (월) 13:39', products: 4 },
    { title: '[CJ단독패키지] 녹는실 리프팅 앰플6박스', platform: 'CJ온스타일 플러스', category: '화장품/미용', time: '26.07.20 (월) 13:45', products: 3 },
    { title: '오한진알부민1', platform: 'NS홈쇼핑 샵플러스', category: '식품', time: '26.07.20 (월) 13:41', products: 2 },
    { title: '[폴앤조] ○ 26SS 퓨어 블룸 슬리브리스 3종 (레이스1+솔리드2)', platform: '롯데원티비', category: '패션의류', time: '26.07.20 (월) 13:40', products: 3 },
    { title: '덴프스 혈당케어 프로 12개월분+10일분 더', platform: 'GS홈쇼핑 마이샵', category: '생활/건강', time: '26.07.20 (월) 13:57', products: 1 },
    { title: '산지직송] 다온바다 왕특대사이즈 16미(미당 100g이상) 총 1.6kg이상', platform: '홈앤쇼핑', category: '식품', time: '26.07.20 (월) 14:20', products: 3 },
    { title: '[방송에서만 이가격] 바이아우어 맥주효모 탈모샴푸 4개 + 컨디셔너 1개', platform: '현대홈쇼핑 플러스샵', category: '화장품/미용', time: '26.07.20 (월) 14:20', products: 2 },
    { title: '[7월중마지막생방송] 락토핏 당케어프로 8+4개월+저당밥솥1대 ', platform: '현대홈쇼핑', category: '식품', time: '26.07.20 (월) 14:25', products: 2 },
    { title: '[1+1+1세트] 스타일리스 미니 에어젯 휴대용 선풍기', platform: 'SK스토아', category: '디지털/가전', time: '26.07.20 (월) 14:31', products: 3 },
  ],
}
