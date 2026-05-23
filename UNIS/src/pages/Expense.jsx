import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getExpenses, createExpense } from '../api/expense'
import { getCategories } from '../api/category'
import { getUserId, getCurrentYearMonth } from '../utils/helpers'

function Expense() {
  const navigate = useNavigate()
  const userId = getUserId()
  const yearMonth = getCurrentYearMonth()

  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // 폼 상태
  const [form, setForm] = useState({
    categoryId: '',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    memo: '',
  })

  useEffect(() => {
    if (!userId) return
    Promise.all([
      getExpenses(userId, yearMonth),
      getCategories(userId),
    ]).then(([expRes, catRes]) => {
      setExpenses(expRes.data.data.expenses ?? [])
      const cats = catRes.data.data.categories
      setCategories(cats)
      if (cats.length > 0) setForm((f) => ({ ...f, categoryId: cats[0].categoryId }))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [userId, yearMonth])

  // 날짜별 그룹핑 (내림차순)
  const grouped = expenses.reduce((acc, exp) => {
    const d = exp.expenseDate
    if (!acc[d]) acc[d] = []
    acc[d].push(exp)
    return acc
  }, {})
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  const handleSubmit = async () => {
    if (!form.amount || Number(form.amount) <= 0) {
      setError('금액을 올바르게 입력해주세요.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await createExpense({
        userId,
        categoryId: Number(form.categoryId),
        amount: Number(form.amount),
        expenseDate: form.expenseDate,
        memo: form.memo,
      })
      const newExp = res.data.data
      setExpenses((prev) => [newExp, ...prev])
      setForm({ categoryId: categories[0]?.categoryId ?? '', amount: '', expenseDate: new Date().toISOString().split('T')[0], memo: '' })
      setShowForm(false)
    } catch (err) {
      setError(err.response?.data?.message ?? '등록에 실패했어요.')
    } finally {
      setSaving(false)
    }
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
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
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-400 text-sm">{y}년 {Number(m)}월</p>
          <h1 className="text-xl font-bold">지출 관리</h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">이번 달 합계</p>
          <p className="font-bold text-blue-500">{totalSpent.toLocaleString()}원</p>
        </div>
      </div>

      {/* 지출 입력 폼 */}
      {showForm && (
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <h2 className="font-bold mb-4">지출 추가</h2>

          <div className="flex flex-col gap-3">
            {/* 카테고리 */}
            <div>
              <p className="text-xs text-gray-400 mb-1">카테고리</p>
              <select
                value={form.categoryId}
                onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-sm outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* 금액 */}
            <div>
              <p className="text-xs text-gray-400 mb-1">금액</p>
              <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2.5">
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  placeholder="0"
                  className="flex-1 text-sm font-bold outline-none bg-transparent"
                />
                <span className="text-sm text-gray-400">원</span>
              </div>
            </div>

            {/* 날짜 */}
            <div>
              <p className="text-xs text-gray-400 mb-1">날짜</p>
              <input
                type="date"
                value={form.expenseDate}
                onChange={(e) => setForm((f) => ({ ...f, expenseDate: e.target.value }))}
                className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>

            {/* 메모 */}
            <div>
              <p className="text-xs text-gray-400 mb-1">메모 (선택)</p>
              <input
                type="text"
                value={form.memo}
                onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
                placeholder="어디서 썼나요?"
                className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => { setShowForm(false); setError('') }}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-400 text-sm font-bold"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-blue-500 text-white text-sm font-bold"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      )}

      {/* 지출 목록 */}
      {sortedDates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-300">
          <p className="text-5xl mb-4">💸</p>
          <p className="text-sm">이번 달 지출 내역이 없어요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sortedDates.map((date) => {
            const dayTotal = grouped[date].reduce((sum, e) => sum + e.amount, 0)
            const [, , dd] = date.split('-')
            return (
              <div key={date} className="bg-white rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold text-sm">{Number(m)}월 {Number(dd)}일</p>
                  <p className="text-sm text-blue-500 font-bold">{dayTotal.toLocaleString()}원</p>
                </div>
                <div className="flex flex-col gap-2">
                  {grouped[date].map((exp) => (
                    <div key={exp.expenseId} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-50 text-blue-400 rounded-full px-2 py-0.5">
                          {exp.categoryName}
                        </span>
                        <span className="text-sm text-gray-600">{exp.memo || '-'}</span>
                      </div>
                      <span className="text-sm font-bold">{exp.amount.toLocaleString()}원</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 플로팅 추가 버튼 */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-20 right-4 w-14 h-14 bg-blue-500 text-white rounded-full text-3xl shadow-lg flex items-center justify-center"
        >
          +
        </button>
      )}
    </div>
  )
}

export default Expense
