import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dummyData } from '../data/dummy'

function Home() {
  const { user, budget, categories } = dummyData
  const remaining = budget.total - budget.spent
  const spentPercent = Math.round((budget.spent / budget.total) * 100)
  const [activeTab, setActiveTab] = useState('budget')
  const navigate = useNavigate()

  const now = new Date()
  const month = now.getMonth() + 1

  return (
    <div className="p-4 pb-24">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-400 text-sm">{month}월 가계부</p>
          <h1 className="text-xl font-bold">{user.name}님 안녕하세요 👋</h1>
        </div>
        <div className="text-center bg-blue-50 rounded-xl px-4 py-2">
          <p className="text-xs text-gray-400">출석</p>
          <p className="text-blue-500 font-bold">{user.streak}일 🔥</p>
        </div>
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

      {/* 탭 내용 */}
      {activeTab === 'budget' ? (
        <>
          {/* 예산 카드 */}
          <div className="bg-blue-500 text-white rounded-2xl p-5 mb-4">
            <p className="text-sm opacity-80 mb-1">이번 달 예산</p>
            <p className="text-3xl font-bold mb-4">{budget.total.toLocaleString()}원</p>
            <div className="bg-white/20 rounded-full h-2 mb-2">
              <div
                className="bg-white rounded-full h-2 animate-grow"
                style={{ '--target-width': `${spentPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>지출 {budget.spent.toLocaleString()}원</span>
              <span>남은 금액 {remaining.toLocaleString()}원</span>
            </div>
          </div>

          {/* 카테고리별 지출 */}
          <div className="bg-white rounded-2xl p-4 mb-4">
            <h2 className="font-bold mb-3">카테고리별 지출</h2>
            <div className="flex flex-col gap-3">
              {categories.map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{cat.name}</span>
                    <span className="text-gray-400">
                      {cat.spent.toLocaleString()} / {cat.budget.toLocaleString()}원
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-blue-400 rounded-full h-1.5 animate-grow"
                      style={{ '--target-width': `${Math.round((cat.spent / cat.budget) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* 캐릭터 탭 */
        <div className="bg-white rounded-2xl p-6 mb-4 flex flex-col items-center">
          <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-6xl">🐣</span>
          </div>
          <p className="font-bold text-lg mb-1">소비 새싹</p>
          <p className="text-gray-400 text-sm mb-4">연속 {user.streak}일 출석 중이에요!</p>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
            className="bg-blue-400 rounded-full h-2 animate-grow"
            style={{ '--target-width': `${spentPercent}%` }} 
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">다음 단계까지 60% 남았어요</p>
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