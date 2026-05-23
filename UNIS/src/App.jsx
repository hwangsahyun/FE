import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Expense from './pages/Expense'
import Budget from './pages/Budget'
import BudgetForm from './pages/BudgetForm'
import BudgetDetail from './pages/BudgetDetail'
import Savings from './pages/Savings'
import Report from './pages/Report'
import MyPage from './pages/MyPage'
import Character from './pages/Character'
import BottomNav from './components/BottomNav'
import { tempLogin } from './api/auth'

function App() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initUser = async () => {
      const existingId = localStorage.getItem('user_id')
      if (!existingId) {
        try {
          const res = await tempLogin()
          const { userId, uuid, nickname } = res.data.data
          localStorage.setItem('user_id', String(userId))
          localStorage.setItem('user_uuid', uuid)
          localStorage.setItem('user_nickname', nickname)
        } catch (err) {
          console.error('임시 로그인 실패:', err)
        }
      }
      setIsReady(true)
    }
    initUser()
  }, [])

  if (!isReady) {
    return (
      <div className="max-w-[430px] mx-auto min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-gray-50 relative">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/budget/new" element={<BudgetForm />} />
        <Route path="/budget/:year/:month" element={<BudgetDetail />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/report" element={<Report />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/character" element={<Character />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default App
