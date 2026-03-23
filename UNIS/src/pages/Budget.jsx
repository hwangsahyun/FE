import { useNavigate } from 'react-router-dom'

function Budget({ budgetList }) {
  const navigate = useNavigate()

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-6">예산 관리</h1>

      {budgetList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-300">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-sm">아직 등록된 예산이 없어요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-4">
          {budgetList
            .sort((a, b) => b.year !== a.year ? b.year - a.year : b.month - a.month)
            .map((budget) => {
              const spentPercent = budget.total > 0
                ? Math.round((budget.spent / budget.total) * 100)
                : 0
              const remaining = budget.total - budget.spent

              return (
                <button
                  key={`${budget.year}-${budget.month}`}
                  onClick={() => navigate(`/budget/${budget.year}/${budget.month}`)}
                  className="bg-white rounded-2xl p-4 text-left w-full"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="font-bold">{budget.year}년 {budget.month}월 예산</h2>
                    <span className="text-xs text-blue-400 bg-blue-50 px-2 py-1 rounded-full">
                      {spentPercent}% 사용
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-1.5 mb-3">
                    <div
                      className="bg-blue-400 rounded-full h-1.5 animate-grow"
                      style={{ '--target-width': `${Math.min(spentPercent, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>총 {budget.total.toLocaleString()}원</span>
                    <span>남은 금액 {remaining.toLocaleString()}원</span>
                  </div>
                </button>
              )
            })}
        </div>
      )}

      <button
        onClick={() => navigate('/budget/new')}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-blue-300 text-blue-400 font-bold text-sm"
      >
        + 새 예산 추가하기
      </button>
    </div>
  )
}

export default Budget