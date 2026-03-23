export const dummyData = {
  user: {
    name: "황사현",
    streak: 5, // 연속 출석일
  },
  budget: {
    total: 600000, // 이번 달 총 예산
    spent: 243500, // 이번 달 지출
  },
  categories: [
    { name: "식비", spent: 120000, budget: 200000 },
    { name: "교통", spent: 43500, budget: 80000 },
    { name: "취미", spent: 50000, budget: 100000 },
    { name: "데이트", spent: 30000, budget: 100000 },
  ],
}

export const defaultCategories = [
  "식비",        // 1위 — 외식, 카페, 편의점 포함
  "교통",        // 대중교통, 택시
  "통신",        // 핸드폰 요금, 인터넷
  "패션/뷰티",   // 의류, 화장품, 미용
  "자기계발",    // 교육, 학습, 책
  "구독",        // 넷플릭스, 스포티파이 등 온라인 서비스
  "여가/취미",   // 운동, 게임, 덕질
  "여행",        // 숙박, 항공
  "의료/건강",   // 병원, 약, 헬스장
  "경조사",      // 선물, 축의금
  "기타",
]

export const dailyExpenses = {
  "2026-03-01": 12000,
  "2026-03-03": 45000,
  "2026-03-05": 8500,
  "2026-03-07": 32000,
  "2026-03-10": 15000,
  "2026-03-12": 67000,
  "2026-03-14": 9000,
  "2026-03-15": 28000,
  "2026-03-17": 41000,
  "2026-03-19": 13500,
  "2026-03-20": 22000,
  "2026-03-21": 5500,
  "2026-03-23": 18000,
}

export const dailyExpenseDetails = {
  "2026-03-01": [
    { category: "식비", description: "편의점", amount: 5500 },
    { category: "교통", description: "지하철", amount: 6500 },
  ],
  "2026-03-03": [
    { category: "식비", description: "점심 식사", amount: 12000 },
    { category: "패션/뷰티", description: "옷 구매", amount: 33000 },
  ],
  "2026-03-05": [
    { category: "식비", description: "카페", amount: 8500 },
  ],
  "2026-03-07": [
    { category: "여가/취미", description: "영화", amount: 14000 },
    { category: "식비", description: "저녁 식사", amount: 18000 },
  ],
  "2026-03-10": [
    { category: "교통", description: "택시", amount: 15000 },
  ],
  "2026-03-12": [
    { category: "식비", description: "외식", amount: 32000 },
    { category: "여가/취미", description: "보드게임카페", amount: 35000 },
  ],
  "2026-03-14": [
    { category: "식비", description: "편의점", amount: 9000 },
  ],
  "2026-03-15": [
    { category: "자기계발", description: "책 구매", amount: 18000 },
    { category: "식비", description: "브런치", amount: 10000 },
  ],
  "2026-03-17": [
    { category: "의료/건강", description: "약국", amount: 8000 },
    { category: "식비", description: "저녁", amount: 15000 },
    { category: "교통", description: "버스", amount: 18000 },
  ],
  "2026-03-19": [
    { category: "식비", description: "카페", amount: 6500 },
    { category: "구독", description: "넷플릭스", amount: 7000 },
  ],
  "2026-03-20": [
    { category: "식비", description: "점심", amount: 9000 },
    { category: "교통", description: "지하철", amount: 13000 },
  ],
  "2026-03-21": [
    { category: "식비", description: "편의점", amount: 5500 },
  ],
  "2026-03-23": [
    { category: "식비", description: "아침", amount: 8000 },
    { category: "교통", description: "버스", amount: 10000 },
  ],
}