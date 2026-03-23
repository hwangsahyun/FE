import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { defaultCategories } from '../data/dummy'

function BudgetForm({ addBudget, budgetList }) {
  const navigate = useNavigate()
  const now = new Date()

  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [totalBudget, setTotalBudget] = useState('')
  const [categoryBudgets, setCategoryBudgets] = useState(
    Object.fromEntries(defaultCategories.map((cat) => [cat, '']))
  )
  const [showPopup, setShowPopup] = useState(false)

  const totalAllocated = Object.values(categoryBudgets).reduce(
    (sum, val) => sum + (Number(val) || 0), 0
  )
  const remaining = (Number(totalBudget) || 0) - totalAllocated
  const isDuplicate = budgetList.some((b) => b.year === year && b.month === month)

  const handleCategoryChange = (cat, value) => {
    setCategoryBudgets((prev) => ({ ...prev, [cat]: value }))
  }

  const handleSave = () => {
    const newCategories = defaultCategories.map((cat) => ({
      name: cat,
      budget: Number(categoryBudgets[cat]) || 0,
      spent: 0,
    }))
    addBudget({
      year,
      month,
      total: Number(totalBudget),
      spent: 0,
      categories: newCategories,
    })
    setShowPopup(true)
  }

  const handlePopupClose = () => {
    setShowPopup(false)
    navigate('/budget')
  }

  return (
    <div className="p-4 pb-24">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/budget')} className="text-gray-400 text-lg">←</button>
        <h1 className="text-xl font-bold">새 예산 추가</h1>
      </div>

      {/* 연도/월 선택 */}
      <div className="bg-white rounded-2xl p-4 mb-4">
        <p className="text-sm text-gray-400 mb-3">예산 기간</p>
        <div className="flex gap-3">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="flex-1 bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none"
          >
            {[2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}년</option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="flex-1 bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{m}월</option>
            ))}
          </select>
        </div>
        {isDuplicate && (
          <p className="text-xs text-red-400 mt-2">⚠ 이미 해당 월 예산이 있어요. 저장하면 덮어씌워져요.</p>
        )}
      </div>

      {/* 월 전체 예산 입력 */}
      <div className="bg-white rounded-2xl p-4 mb-4">
        <p className="text-sm text-gray-400 mb-2">월 전체 예산</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            placeholder="0"
            className="flex-1 text-2xl font-bold outline-none"
          />
          <span className="text-2xl font-bold text-gray-400">원</span>
        </div>
      </div>

      {/* 남은 예산 표시 */}
      <div className={`rounded-2xl p-4 mb-4 ${remaining < 0 ? 'bg-red-50' : 'bg-blue-50'}`}>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">배분 가능한 예산</p>
          <p className={`font-bold text-lg ${remaining < 0 ? 'text-red-500' : 'text-blue-500'}`}>
            {remaining.toLocaleString()}원
          </p>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-400">배분된 예산</p>
          <p className="text-sm text-gray-500">{totalAllocated.toLocaleString()}원</p>
        </div>
        {totalBudget && (
          <div className="bg-white/60 rounded-full h-1.5 mt-3">
            <div
              className={`rounded-full h-1.5 animate-grow ${remaining < 0 ? 'bg-red-400' : 'bg-blue-400'}`}
              style={{ '--target-width': `${Math.min((totalAllocated / Number(totalBudget)) * 100, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* 카테고리별 예산 */}
      <div className="bg-white rounded-2xl p-4 mb-4">
        <h2 className="font-bold mb-4">카테고리별 예산</h2>
        <div className="flex flex-col gap-4">
          {defaultCategories.map((cat) => (
            <div key={cat} className="flex items-center justify-between gap-4">
              <span className="text-sm w-20 shrink-0">{cat}</span>
              <div className="flex items-center gap-1 flex-1">
                <input
                  type="number"
                  value={categoryBudgets[cat]}
                  onChange={(e) => handleCategoryChange(cat, e.target.value)}
                  placeholder="0"
                  className="w-full text-right outline-none text-sm bg-gray-50 rounded-lg px-3 py-2"
                />
                <span className="text-sm text-gray-400 shrink-0">원</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        className={`w-full py-4 rounded-2xl font-bold text-white transition-all ${
          remaining < 0 || !totalBudget ? 'bg-gray-300' : 'bg-blue-500'
        }`}
        disabled={remaining < 0 || !totalBudget}
      >
        저장하기
      </button>

      {/* 팝업 */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 mx-8 text-center">
            <p className="text-4xl mb-3">🎉</p>
            <h2 className="font-bold text-lg mb-2">{year}년 {month}월 예산이 저장됐어요!</h2>
            <p className="text-gray-400 text-sm mb-6">
              이번 달도 계획적으로, 현명하게!<br />응원할게요 💪
            </p>
            <button
              onClick={handlePopupClose}
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BudgetForm