import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMonthlyBudget, updateMonthlyBudget } from '../api/budget'
import { getCategories } from '../api/category'
import { getUserId } from '../utils/helpers'

function BudgetDetail() {
  const navigate = useNavigate()
  const { year, month } = useParams()
  const userId = getUserId()

  const [budget, setBudget] = useState(null)
  const [categories, setCategories] = useState([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [totalBudget, setTotalBudget] = useState('')
  const [categoryBudgets, setCategoryBudgets] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const menuRef = useRef(null)

  const yearMonth = `${year}-${String(month).padStart(2, '0')}`

  useEffect(() => {
    if (!userId) return
    Promise.all([
      getMonthlyBudget(userId, yearMonth),
      getCategories(userId),
    ])
      .then(([budgetRes, catRes]) => {
        const b = budgetRes.data.data
        const cats = catRes.data.data.categories
        setBudget(b)
        setCategories(cats)
        setTotalBudget(String(b.totalAmount))

        // 카테고리별 현재 예산 초기값
        const budgetMap = {}
        cats.forEach((cat) => {
          const existing = b.categoryBudgets.find((cb) => cb.categoryId === cat.categoryId)
          budgetMap[cat.categoryId] = existing ? String(existing.amount) : ''
        })
        setCategoryBudgets(budgetMap)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [userId, yearMonth])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const totalAllocated = Object.values(categoryBudgets).reduce(
    (sum, val) => sum + (Number(val) || 0), 0
  )
  const remaining = (Number(totalBudget) || 0) - totalAllocated
  const isOverBudget = remaining < 0

  const handleSave = async () => {
    setSaving(true)
    setError('')
    const categoryBudgetList = categories
      .filter((cat) => Number(categoryBudgets[cat.categoryId]) > 0)
      .map((cat) => ({
        categoryId: cat.categoryId,
        amount: Number(categoryBudgets[cat.categoryId]),
      }))

    try {
      const res = await updateMonthlyBudget(budget.monthlyBudgetId, {
        totalAmount: Number(totalBudget),
        categoryBudgets: categoryBudgetList,
      })
      setBudget(res.data.data)
      setIsEditMode(false)
    } catch (err) {
      const msg = err.response?.data?.message ?? '예산 수정에 실패했어요.'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 pb-24 flex items-center justify-center min-h-[80vh]">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    )
  }

  if (!budget) {
    return (
      <div className="p-4">
        <p className="text-gray-400">예산을 찾을 수 없어요.</p>
      </div>
    )
  }

  return (
    <div className="p-4 pb-24">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/budget')} className="text-gray-400 text-lg">←</button>
          <h1 className="text-xl font-bold">{year}년 {Number(month)}월 예산</h1>
        </div>

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
                onClick={() => { setIsEditMode(true); setMenuOpen(false) }}
                className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50"
              >
                수정하기
              </button>
              <button
                onClick={() => { setShowDeletePopup(true); setMenuOpen(false) }}
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
            <p className="text-3xl font-bold mb-4">{budget.totalAmount.toLocaleString()}원</p>
            <div className="bg-white/20 rounded-full h-2 mb-2">
              <div className="bg-white rounded-full h-2" style={{ width: '0%' }} />
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>총 예산</span>
              <span>{budget.totalAmount.toLocaleString()}원</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4">
            <h2 className="font-bold mb-4">카테고리별 예산</h2>
            <div className="flex flex-col gap-4">
              {budget.categoryBudgets.map((cb) => (
                <div key={cb.categoryBudgetId}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{cb.categoryName}</span>
                    <span className="text-gray-400">{cb.amount.toLocaleString()}원</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-1.5">
                    <div className="bg-blue-400 rounded-full h-1.5" style={{ width: '0%' }} />
                  </div>
                </div>
              ))}
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
          </div>

          <div className="bg-white rounded-2xl p-4 mb-4">
            <h2 className="font-bold mb-4">카테고리별 예산</h2>
            <div className="flex flex-col gap-4">
              {categories.map((cat) => (
                <div key={cat.categoryId} className="flex items-center justify-between gap-4">
                  <span className="text-sm w-24 shrink-0">{cat.name}</span>
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

          {error && <p className="text-sm text-red-400 text-center mb-3">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => { setIsEditMode(false); setError('') }}
              className="flex-1 py-4 rounded-2xl font-bold border border-gray-200 text-gray-400"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={isOverBudget || !totalBudget || saving}
              className={`flex-1 py-4 rounded-2xl font-bold text-white ${
                isOverBudget || !totalBudget || saving ? 'bg-gray-300' : 'bg-blue-500'
              }`}
            >
              {saving ? '저장 중...' : '완료하기'}
            </button>
          </div>
        </>
      )}

      {/* 삭제 팝업 — MVP에서는 삭제 API 없으므로 안내만 표시 */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 mx-8 text-center">
            <p className="text-4xl mb-3">ℹ️</p>
            <h2 className="font-bold text-lg mb-2">예산 삭제</h2>
            <p className="text-gray-400 text-sm mb-6">
              예산 삭제 기능은 준비 중이에요.
            </p>
            <button
              onClick={() => setShowDeletePopup(false)}
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

export default BudgetDetail
