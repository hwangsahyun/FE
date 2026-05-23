import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHome } from '../api/home'
import { getExpenses } from '../api/expense'
import { getUserId, getCurrentYearMonth } from '../utils/helpers'

function Home() {
  const navigate = useNavigate()
  const [homeData, setHomeData] = useState(null)
  const [dailyExpenses, setDailyExpenses] = useState({})
  const [dailyExpenseDetails, setDailyExpenseDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('budget')
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const today = now.getDate()
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  const todayWeekday = weekdays[now.getDay()]
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const yearMonth = getCurrentYearMonth()

  useEffect(() => {
    const userId = getUserId()
    if (!userId) return

    Promise.all([
      getHome(userId, yearMonth).catch(() => null),
      getExpenses(userId, yearMonth).catch(() => ({ data: { data: { expenses: [] } } })),
    ]).then(([homeRes, expenseRes]) => {
      if (homeRes) setHomeData(homeRes.data.data)

      // 소비 내역 → 날짜별 집계
      const expenses = expenseRes?.data?.data?.expenses ?? []
      const byDay = {}
      const byDayDetail = {}
      expenses.forEach((exp) => {
        const d = exp.expenseDate
        byDay[d] = (byDay[d] || 0) + exp.amount
        if (!byDayDetail[d]) byDayDetail[d] = []
        byDayDetail[d].push({
          category: exp.categoryName,
          description: exp.memo || '-',
          amount: exp.amount,
        })
      })
      setDailyExpenses(byDay)
      setDailyExpenseDetails(byDayDetail)
      setLoading(false)
    })
  }, [yearMonth])

  const formatDate = (d) => {
    const mm = String(month).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    return `${year}-${mm}-${dd}`
  }

  const handleDateClick = (day) => {
    const dateKey = formatDate(day)
    setSelectedDate(selectedDate === dateKey ? null : dateKey)
  }

  if (loading) {
    return (
      <div className="p-4 pb-24 flex items-center justify-center min-h-[80vh]">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    )
  }

  const nickname = homeData?.user?.nickname ?? localStorage.getItem('user_nickname') ?? '사용자'
  const character = homeData?.character
  const budget = homeData?.budget
  const categories = homeData?.categories ?? []
  const recentExpenses = homeData?.recentExpenses ?? []
  const aiMessage = homeData?.aiMessage

  const hasBudget = !!budget && budget.totalAmount > 0
  const spentPercent = hasBudget
    ? Math.min(Math.round((budget.totalSpentAmount / budget.totalAmount) * 100), 100)
    : 0

  return (
    <div className="p-4 pb-24">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-400 text-sm">
            {year}년 {month}월 {today}일 ({todayWeekday})
          </p>
          <h1 className="text-xl font-bold">{nickname}님 안녕하세요 👋</h1>
        </div>
        {character && (
          <div className="text-center bg-blue-50 rounded-xl px-4 py-2">
            <p className="text-xs text-gray-400">코인</p>
            <p className="text-blue-500 font-bold">{character.coin} 🪙</p>
          </div>
        )}
      </div>

      {/* 탭 전환 */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
        <button
          onClick={() => setActiveTab('budget')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'budget' ? 'bg-white text-blue-500 shadow-sm' : 'text-gray-400'
          }`}
        >
          예산 현황
        </button>
        <button
          onClick={() => setActiveTab('character')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'character' ? 'bg-white text-blue-500 shadow-sm' : 'text-gray-400'
          }`}
        >
          캐릭터
        </button>
      </div>

      {/* 예산 현황 탭 */}
      {activeTab === 'budget' && (
        <>
          {/* 예산 없을 때 */}
          {!hasBudget ? (
            <div className="bg-blue-50 rounded-2xl p-5 mb-4 text-center">
              <p className="text-gray-500 text-sm mb-3">이번 달 예산이 아직 없어요</p>
              <button
                onClick={() => navigate('/budget/new')}
                className="bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-bold"
              >
                예산 설정하기 →
              </button>
            </div>
          ) : (
            <>
              {/* 예산 카드 */}
              <div className="bg-blue-500 text-white rounded-2xl p-5 mb-4">
                <p className="text-sm opacity-80 mb-1">이번 달 예산</p>
                <p className="text-3xl font-bold mb-4">{budget.totalAmount.toLocaleString()}원</p>
                <div className="bg-white/20 rounded-full h-2 mb-2">
                  <div
                    className="bg-white rounded-full h-2 animate-grow"
                    style={{ '--target-width': `${spentPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>지출 {budget.totalSpentAmount.toLocaleString()}원</span>
                  <span>남은 금액 {budget.remainingAmount.toLocaleString()}원</span>
                </div>
              </div>

              {/* AI 메시지 */}
              {aiMessage && (
                <div className="bg-blue-50 rounded-2xl p-3 mb-4 flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <p className="text-sm text-blue-700">{aiMessage}</p>
                </div>
              )}

              {/* 카테고리별 지출 */}
              {categories.length > 0 && (
                <div className="bg-white rounded-2xl p-4 mb-4">
                  <h2 className="font-bold mb-3">카테고리별 지출</h2>
                  <div className="flex flex-col gap-3">
                    {categories.map((cat) => (
                      <div key={cat.categoryId}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{cat.categoryName}</span>
                          <span className="text-gray-400">
                            {cat.spentAmount.toLocaleString()} / {cat.budgetAmount.toLocaleString()}원
                          </span>
                        </div>
                        <div className="bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-blue-400 rounded-full h-1.5 animate-grow"
                            style={{ '--target-width': `${Math.min(cat.usageRate, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* 캘린더 */}
          <div className="bg-white rounded-2xl p-4 mb-4">
            <button
              onClick={() => {
                setCalendarOpen(!calendarOpen)
                setSelectedDate(null)
              }}
              className="w-full flex justify-between items-center"
            >
              <h2 className="font-bold">{month}월 지출 캘린더</h2>
              <span className="text-gray-400 text-sm">{calendarOpen ? '▲ 접기' : '▼ 펼치기'}</span>
            </button>

            {calendarOpen && (
              <div className="mt-4">
                <div className="grid grid-cols-7 mb-2">
                  {weekdays.map((d) => (
                    <p key={d} className={`text-center text-xs font-bold ${
                      d === '일' ? 'text-red-400' : d === '토' ? 'text-blue-400' : 'text-gray-400'
                    }`}>
                      {d}
                    </p>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-2">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dateKey = formatDate(day)
                    const expense = dailyExpenses[dateKey]
                    const isToday = day === today
                    const isSelected = selectedDate === dateKey
                    return (
                      <button
                        key={day}
                        onClick={() => handleDateClick(day)}
                        className="flex flex-col items-center gap-0.5"
                      >
                        <p className={`text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold transition-all ${
                          isSelected ? 'bg-blue-400 text-white' :
                          isToday ? 'bg-blue-500 text-white' : 'text-gray-700'
                        }`}>
                          {day}
                        </p>
                        {expense ? (
                          <p className="text-[10px] text-blue-400 font-bold leading-tight text-center">
                            {(expense / 1000).toFixed(0)}k
                          </p>
                        ) : (
                          <p className="text-[10px] leading-tight">&nbsp;</p>
                        )}
                      </button>
                    )
                  })}
                </div>

                {selectedDate && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm font-bold mb-3 text-gray-600">
                      {parseInt(selectedDate.split('-')[2])}일 지출 내역
                    </p>
                    {dailyExpenseDetails[selectedDate] ? (
                      <div className="flex flex-col gap-2">
                        {dailyExpenseDetails[selectedDate].map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <div>
                              <span className="text-xs bg-blue-50 text-blue-400 rounded-full px-2 py-0.5 mr-2">
                                {item.category}
                              </span>
                              <span className="text-sm text-gray-600">{item.description}</span>
                            </div>
                            <span className="text-sm font-bold">{item.amount.toLocaleString()}원</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-1">
                          <span className="text-sm text-gray-400">합계</span>
                          <span className="font-bold text-blue-500">
                            {dailyExpenseDetails[selectedDate]
                              .reduce((sum, item) => sum + item.amount, 0)
                              .toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-2">지출 내역이 없어요</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* 캐릭터 탭 */}
      {activeTab === 'character' && (
        <div className="bg-white rounded-2xl p-6 mb-4 flex flex-col items-center">
          <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-6xl">🐣</span>
          </div>
          <p className="font-bold text-lg mb-1">{character?.name ?? '기본 캐릭터'}</p>
          <p className="text-gray-400 text-sm mb-4">코인 {character?.coin ?? 0}개 보유 중</p>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-blue-400 rounded-full h-2 animate-grow"
              style={{ '--target-width': `${character?.feelingXp ?? 0}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            기분 경험치 {character?.feelingXp ?? 0} / 100
          </p>
        </div>
      )}

      {/* 최근 소비 내역 */}
      {recentExpenses.length > 0 && (
        <div className="bg-white rounded-2xl p-4 mb-4">
          <h2 className="font-bold mb-3">최근 소비</h2>
          <div className="flex flex-col gap-2">
            {recentExpenses.map((exp) => (
              <div key={exp.expenseId} className="flex justify-between items-center">
                <div>
                  <span className="text-xs bg-blue-50 text-blue-400 rounded-full px-2 py-0.5 mr-2">
                    {exp.categoryName}
                  </span>
                  <span className="text-sm text-gray-600">{exp.memo || '-'}</span>
                </div>
                <span className="text-sm font-bold">{exp.amount.toLocaleString()}원</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 리포트 / 저축 카드 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => navigate('/report')}
          className="bg-white rounded-2xl p-4 text-left"
        >
          <p className="text-xs text-gray-400 mb-1">이번 달</p>
          <p className="font-bold">리포트 보기 →</p>
        </button>
        <button
          onClick={() => navigate('/savings')}
          className="bg-white rounded-2xl p-4 text-left"
        >
          <p className="text-xs text-gray-400 mb-1">저축 현황</p>
          <p className="font-bold">저축 보기 →</p>
        </button>
      </div>

      {/* 플로팅 버튼 */}
      <button
        onClick={() => navigate('/expense')}
        className="fixed bottom-20 right-4 w-14 h-14 bg-blue-500 text-white rounded-full text-3xl shadow-lg flex items-center justify-center"
      >
        +
      </button>
    </div>
  )
}

export default Home
