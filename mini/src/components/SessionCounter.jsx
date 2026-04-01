export default function SessionCounter({ sessions }) {
  return (
    <div className="mt-6 text-gray-500 text-sm">
      오늘 완료한 세션: <span className="font-bold text-gray-800">{sessions}</span> 🍅
    </div>
  )
}