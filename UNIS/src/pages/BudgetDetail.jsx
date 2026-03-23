import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { defaultCategories } from '../data/dummy'

function BudgetDetail({ budgetList, addBudget, deleteBudget }) {
  const navigate = useNavigate()
  const { year, month } = useParams()
  const budget = budgetList.find(
    (b) => b.year === Number(year) && b.month === Number(month)
  )

  const [isEditMode, setIsEditMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [totalBudget, setTotalBudget] = useState(budget?.total || '')
  const [categoryBudgets, setCategoryBudgets] = useState(
    Object.fromEntries(
      defaultCategories.map((cat) => {
        const existing = budget?.categories.find((c) => c.name === cat)
        return [cat, existing ? existing.budget : '']
      })
    )
  )

  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!budget) {
    return (
      <div className="p-4">
        <p className="text-gray-400">예산을 찾을 수 없어요.</p>
      </div>
    )
  }

  const totalAllocated = Object.values(categoryBudgets).reduce(
    (sum, val) => sum + (Number(val) || 0), 0
  )
  const remaining = (Number(totalBudget) || 0) - totalAllocated

  const handleSave = () => {
    const newCategories = defaultCategories.map((cat) => ({
      name: cat,
      budget: Number(categoryBudgets[cat]) || 0,
      spent: budget.categories.find((c) => c.name === cat)?.spent || 0,
    }))
    addBudget({
      year: Number(year),
      month: Number(month),
      total: Number(totalBudget),
      spent: budget.spent,
      categories: newCategories,
    })
    setIsEditMode(false)
  }

  const handleDelete = () => {
    deleteBudget(Number(year), Number(month))
    navigate('/budget')
  }

  return (
    <div className="p-4 pb-24">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/budget')} className="text-gray-400 text-lg">←</button>
          <h1 className="text-xl font-bold">{year}년 {month}월 예산</h1>
        </div>

        {/* ... 메뉴 */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-400 text-xl px-2"
          >
            ···
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg z-10 overflow-hidden w-32">
              <button
                onClick={() => {
                  setIsEditMode(true)
                  setMenuOpen(false)
                }}
                className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50"
              >
                수정하기
              </button>
              <button
                onClick={() => {
                  setShowDeletePopup(true)
                  setMenuOpen(false)
                }}
                className="w-full px-4 py-3 text-sm text-left text-red-400 hover:bg-gray-50"
              >
                삭제하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 조회 모드 */}
      {!isEditMode && (
        <>
          <div className="bg-blue-500 text-white rounded-2xl p-5 mb-4">
            <p className="text-sm opacity-80 mb-1">월 예산</p>
            <p className="text-3xl font-bold mb-4">{budget.total.toLocaleString()}원</p>
            <div className="bg-white/20 rounded-full h-2 mb-2">
              <div
                className="bg-white rounded-full h-2 animate-grow"
                style={{ '--target-width': `${Math.min(Math.round((budget.spent / budget.total) * 100), 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>지출 {budget.spent.toLocaleString()}원</span>
              <span>남은 금액 {(budget.total - budget.spent).toLocaleString()}원</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <h2 className="font-bold mb-4">카테고리별 예산</h2>
            <div className="flex flex-col gap-4">
              {defaultCategories.map((cat) => {
                const catData = budget.categories.find((c) => c.name === cat)
                if (!catData || catData.budget === 0) return null
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{cat}</span>
                      <span className="text-gray-400">{catData.budget.toLocaleString()}원</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-blue-400 rounded-full h-1.5 animate-grow"
                        style={{ '--target-width': `${Math.min(Math.round((catData.spent / catData.budget) * 100), 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* 수정 모드 */}
      {isEditMode && (
        <>
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
          </div>

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
                      onChange={(e) =>
                        setCategoryBudgets((prev) => ({ ...prev, [cat]: e.target.value }))
                      }
                      placeholder="0"
                      className="w-full text-right outline-none text-sm bg-gray-50 rounded-lg px-3 py-2"
                    />
                    <span className="text-sm text-gray-400 shrink-0">원</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsEditMode(false)}
              className="flex-1 py-4 rounded-2xl font-bold border border-gray-200 text-gray-400"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={remaining < 0 || !totalBudget}
              className={`flex-1 py-4 rounded-2xl font-bold text-white ${
                remaining < 0 || !totalBudget ? 'bg-gray-300' : 'bg-blue-500'
              }`}
            >
              완료하기
            </button>
          </div>
        </>
      )}

      {/* 삭제 팝업 */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 mx-8 text-center">
            <p className="text-4xl mb-3">🗑️</p>
            <h2 className="font-bold text-lg mb-2">예산을 삭제할까요?</h2>
            <p className="text-gray-400 text-sm mb-6">
              {year}년 {month}월 예산이 삭제돼요.<br />이 작업은 되돌릴 수 없어요.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-400 font-bold"
              >
                취소하기
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl bg-red-400 text-white font-bold"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BudgetDetail