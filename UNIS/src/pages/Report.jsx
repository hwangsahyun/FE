import { useState, useEffect } from 'react'
import { getWeeklyReport, getMonthlyReport } from '../api/report'
import { getUserId, getCurrentYearMonth } from '../utils/helpers'

function Report() {
  const userId = getUserId()
  const yearMonth = getCurrentYearMonth()
  const [tab, setTab] = useState('monthly')
  const [weekly, setWeekly] = useState(null)
  const [monthly, setMonthly] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    Promise.all([
      getWeeklyReport(userId).catch(() => null),
      getMonthlyReport(userId, yearMonth).catch(() => null),
    ]).then(([wRes, mRes]) => {
      if (wRes) setWeekly(wRes.data.data)
      if (mRes) setMonthly(mRes.data.data)
      setLoading(false)
    })
  }, [userId, yearMonth])

  const [y, m] = yearMonth.split('-')

  if (loading) {
    return (
      <div className="p-4 pb-24 flex items-center justify-center min-h-[80vh]">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-6">소비 리포트</h1>

      {/* 탭 */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
        <button
          onClick={() => setTab('monthly')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
            tab === 'monthly' ? 'bg-white text-blue-500 shadow-sm' : 'text-gray-400'
          }`}
        >
          월간
        </button>
        <button
          onClick={() => setTab('weekly')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
            tab === 'weekly' ? 'bg-white text-blue-500 shadow-sm' : 'text-gray-400'
          }`}
        >
          주간
        </button>
      </div>

      {/* 월간 리포트 */}
      {tab === 'monthly' && (
        monthly ? (
          <>
            {/* 요약 카드 */}
            <div className="bg-blue-500 text-white rounded-2xl p-5 mb-4">
              <p className="text-sm opacity-80 mb-1">{y}년 {Number(m)}월 소비</p>
              <p className="text-3xl font-bold mb-4">
                {monthly.monthlySpentAmount.toLocaleString()}원
              </p>
              <div className="bg-white/20 rounded-full h-2 mb-2">
                <div
                  className="bg-white rounded-full h-2 animate-grow"
                  style={{ '--target-width': `${Math.min(monthly.budgetUsageRate, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>예산 {monthly.totalBudgetAmount.toLocaleString()}원</span>
                <span>사용률 {monthly.budgetUsageRate.toFixed(1)}%</span>
              </div>
            </div>

            {/* 남은 예산 */}
            <div className="bg-white rounded-2xl p-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">남은 예산</p>
                  <p className="font-bold text-lg">{monthly.remainingAmount.toLocaleString()}원</p>
                </div>
                {monthly.topCategory && (
                  <div className="text-right">
                    <p className="text-xs text-gray-400">최다 지출</p>
                    <p className="font-bold text-blue-500">{monthly.topCategory.categoryName}</p>
                    <p className="text-xs text-gray-400">
                      {monthly.topCategory.spentAmount.toLocaleString()}원
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 카테고리별 */}
            <div className="bg-white rounded-2xl p-4 mb-4">
              <h2 className="font-bold mb-4">카테고리별 지출</h2>
              <div className="flex flex-col gap-4">
                {monthly.categoryReports.map((cat) => (
                  <div key={cat.categoryId}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{cat.categoryName}</span>
                      <span className="text-gray-400">
                        {cat.spentAmount.toLocaleString()}원
                        <span className="text-xs ml-1">({cat.spendingRatio.toFixed(1)}%)</span>
                      </span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-blue-400 rounded-full h-1.5 animate-grow"
                        style={{ '--target-width': `${Math.min(cat.budgetUsageRate, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-300 mt-0.5">
                      <span>예산 대비 {cat.budgetUsageRate.toFixed(1)}%</span>
                      <span>예산 {cat.budgetAmount.toLocaleString()}원</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI 피드백 */}
            {monthly.aiFeedback && (
              <div className="bg-blue-50 rounded-2xl p-4">
                <p className="text-xs text-blue-400 font-bold mb-1">💡 AI 피드백</p>
                <p className="text-sm text-gray-700">{monthly.aiFeedback}</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <p className="text-5xl mb-4">📊</p>
            <p className="text-sm">이번 달 예산 또는 소비 데이터가 없어요</p>
          </div>
        )
      )}

      {/* 주간 리포트 */}
      {tab === 'weekly' && (
        weekly ? (
          <>
            {/* 기간 + 합계 */}
            <div className="bg-blue-500 text-white rounded-2xl p-5 mb-4">
              <p className="text-sm opacity-80 mb-1">
                {weekly.startDate} ~ {weekly.endDate}
              </p>
              <p className="text-3xl font-bold">{weekly.weeklySpentAmount.toLocaleString()}원</p>
            </div>

            {/* 최다 지출 카테고리 */}
            {weekly.topCategory && (
              <div className="bg-white rounded-2xl p-4 mb-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">이번 주 가장 많이 쓴 곳</p>
                  <p className="font-bold">{weekly.topCategory.categoryName}</p>
                </div>
                <p className="font-bold text-blue-500">
                  {weekly.topCategory.spentAmount.toLocaleString()}원
                </p>
              </div>
            )}

            {/* 카테고리별 */}
            <div className="bg-white rounded-2xl p-4 mb-4">
              <h2 className="font-bold mb-4">카테고리별 지출</h2>
              <div className="flex flex-col gap-4">
                {weekly.categoryReports.map((cat) => (
                  <div key={cat.categoryId}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{cat.categoryName}</span>
                      <span className="text-gray-400">
                        {cat.spentAmount.toLocaleString()}원
                        <span className="text-xs ml-1">({cat.spendingRatio.toFixed(1)}%)</span>
                      </span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-blue-400 rounded-full h-1.5 animate-grow"
                        style={{ '--target-width': `${Math.min(cat.spendingRatio, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 피드백 */}
            {weekly.feedback && (
              <div className="bg-blue-50 rounded-2xl p-4">
                <p className="text-xs text-blue-400 font-bold mb-1">💡 피드백</p>
                <p className="text-sm text-gray-700">{weekly.feedback}</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <p className="text-5xl mb-4">📊</p>
            <p className="text-sm">이번 주 소비 데이터가 없어요</p>
          </div>
        )
      )}
    </div>
  )
}

export default Report
