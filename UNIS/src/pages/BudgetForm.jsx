import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategories } from '../api/category'
import { createMonthlyBudget } from '../api/budget'
import { getUserId } from '../utils/helpers'

function BudgetForm() {
  const navigate = useNavigate()
  const now = new Date()

  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [totalBudget, setTotalBudget] = useState('')
  const [categories, setCategories] = useState([])
  const [categoryBudgets, setCategoryBudgets] = useState({})
  const [showPopup, setShowPopup] = useState(false)
  const [saving, setSaving] = useState(false)

  // 토스트 (DELTA BudgetSetupScreen과 동일한 구조)
  const [toast, setToast] = useState(null)
  const [toastFading, setToastFading] = useState(false)

  const userId = getUserId()

  useEffect(() => {
    if (!userId) return
    getCategories(userId)
      .then((res) => {
        const cats = res.data.data.categories
        setCategories(cats)
        setCategoryBudgets(
          Object.fromEntries(cats.map((c) => [c.categoryId, '']))
        )
      })
      .catch(console.error)
  }, [userId])

  const totalAllocated = Object.values(categoryBudgets).reduce(
    (sum, val) => sum + (Number(val) || 0), 0
  )
  const totalBudgetNum = Number(totalBudget) || 0
  const remaining = totalBudgetNum - totalAllocated
  const isOverBudget = remaining < 0

  function showToast(message) {
    setToast(message)
    setToastFading(false)
    setTimeout(() => {
      setToastFading(true)
      setTimeout(() => setToast(null), 300)
    }, 1700)
  }

  const handleSave = async () => {
    // DELTA BudgetSetupScreen의 handleComplete와 동일한 검증 순서
    if (!totalBudget) {
      showToast('총 예산을 먼저 입력해주세요!')
      return
    }
    if (totalAllocated > totalBudgetNum) {
      showToast(`${(totalAllocated - totalBudgetNum).toLocaleString()}원 초과해서 입력되었어요!`)
      return
    }
    if (totalAllocated < totalBudgetNum) {
      showToast(`${(totalBudgetNum - totalAllocated).toLocaleString()}원이 아직 배분되지 않았어요!`)
      return
    }

    setSaving(true)
    const yearMonth = `${year}-${String(month).padStart(2, '0')}`
    const categoryBudgetList = categories
      .filter((cat) => Number(categoryBudgets[cat.categoryId]) > 0)
      .map((cat) => ({
        categoryId: cat.categoryId,
        amount: Number(categoryBudgets[cat.categoryId]),
      }))

    try {
      await createMonthlyBudget({
        userId,
        yearMonth,
        totalAmount: totalBudgetNum,
        categoryBudgets: categoryBudgetList,
      })
      setShowPopup(true)
    } catch (err) {
      const msg = err.response?.data?.message ?? '예산 등록에 실패했어요.'
      showToast(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 pb-24">

      {/* 토스트 (DELTA와 동일한 스타일) */}
      {toast && (
        <div
          className={`fixed z-50 flex items-center rounded-2xl shadow-md ${toastFading ? 'toast-exit' : 'toast-enter'}`}
          style={{
            bottom: '96px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#FECACA',
            border: '1px solid #FECACA',
            whiteSpace: 'nowrap',
            padding: '4px 12px',
          }}
        >
          <span className="font-medium text-red-400" style={{ fontSize: '11px' }}>{toast}</span>
        </div>
      )}

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

      {/* 배분 현황 */}
      <div className={`rounded-2xl p-4 mb-4 ${isOverBudget ? 'bg-red-50' : 'bg-blue-50'}`}>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">배분 가능한 예산</p>
          <p className={`font-bold text-lg ${isOverBudget ? 'text-red-500' : 'text-blue-500'}`}>
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
              className={`rounded-full h-1.5 animate-grow ${isOverBudget ? 'bg-red-400' : 'bg-blue-400'}`}
              style={{ '--target-width': `${Math.min((totalAllocated / totalBudgetNum) * 100, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* 카테고리별 예산 */}
      {categories.length > 0 && (
        <div className="bg-white rounded-2xl p-4 mb-4">
          <h2 className="font-bold mb-4">카테고리별 예산</h2>
          <div className="flex flex-col gap-4">
            {categories.map((cat) => (
              <div key={cat.categoryId} className="flex items-center justify-between gap-4">
                <span className="text-sm w-24 shrink-0">
                  {cat.name}
                  {cat.isDefault && (
                    <span className="ml-1 text-[10px] text-gray-300">기본</span>
                  )}
                </span>
                <div className="flex items-center gap-1 flex-1">
                  <input
                    type="number"
                    value={categoryBudgets[cat.categoryId] ?? ''}
                    onChange={(e) =>
                      setCategoryBudgets((prev) => ({ ...prev, [cat.categoryId]: e.target.value }))
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
      )}

      {/* 저장 버튼 — 항상 활성, 검증은 클릭 시 토스트로 처리 */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 rounded-2xl font-bold text-white bg-blue-500 transition-all disabled:opacity-60"
      >
        {saving ? '저장 중...' : '저장하기'}
      </button>

      {/* 완료 팝업 */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 mx-8 text-center">
            <p className="text-4xl mb-3">🎉</p>
            <h2 className="font-bold text-lg mb-2">{year}년 {month}월 예산이 저장됐어요!</h2>
            <p className="text-gray-400 text-sm mb-6">
              이번 달도 계획적으로, 현명하게!<br />응원할게요 💪
            </p>
            <button
              onClick={() => navigate('/budget')}
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
