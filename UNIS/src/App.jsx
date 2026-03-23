import { useState } from 'react'
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
import { dummyData } from './data/dummy'

function App() {
  const [budgetList, setBudgetList] = useState([
    {
      year: 2026,
      month: 3,
      total: dummyData.budget.total,
      spent: dummyData.budget.spent,
      categories: dummyData.categories,
    }
  ])

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const currentBudget = budgetList.find(
    (b) => b.year === currentYear && b.month === currentMonth
  ) || { total: 0, spent: 0, categories: [] }

  const addBudget = (newBudget) => {
    setBudgetList((prev) => {
      const filtered = prev.filter(
        (b) => !(b.year === newBudget.year && b.month === newBudget.month)
      )
      return [...filtered, newBudget]
    })
  }

  const deleteBudget = (year, month) => {
    setBudgetList((prev) =>
      prev.filter((b) => !(b.year === year && b.month === month))
    )
  }

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-gray-50 relative">
      <Routes>
        <Route path="/" element={<Home budgetData={currentBudget} />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/budget" element={<Budget budgetList={budgetList} />} />
        <Route path="/budget/new" element={<BudgetForm addBudget={addBudget} budgetList={budgetList} />} />
        <Route path="/budget/:year/:month" element={<BudgetDetail budgetList={budgetList} addBudget={addBudget} deleteBudget={deleteBudget} />} />
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