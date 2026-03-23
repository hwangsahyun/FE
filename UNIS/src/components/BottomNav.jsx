import { useNavigate, useLocation } from 'react-router-dom'

const menus = [
  { path: '/expense', label: '지출' },
  { path: '/budget', label: '예산' },
  { path: '/', label: '홈' },
  { path: '/character', label: '캐릭터' },
  { path: '/mypage', label: '마이' },
]

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16">
      {menus.map((menu) => (
        <button
          key={menu.path}
          onClick={() => navigate(menu.path)}
          className={`flex flex-col items-center text-xs gap-1 px-3 py-2 ${
            location.pathname === menu.path ? 'text-blue-500' : 'text-gray-400'
          }`}
        >
          {menu.label}
        </button>
      ))}
    </nav>
  )
}

export default BottomNav