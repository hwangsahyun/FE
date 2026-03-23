import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Expense from './pages/Expense'
import Budget from './pages/Budget'
import Savings from './pages/Savings'
import Report from './pages/Report'
import MyPage from './pages/MyPage'
import Character from './pages/Character'
import BottomNav from './components/BottomNav'

function App() {
  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-gray-50 relative">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/budget" element={<Budget />} />
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