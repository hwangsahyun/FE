export default function ModeLabel({ isFocus }) {
  return (
    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
      isFocus
        ? 'bg-red-100 text-red-600'
        : 'bg-green-100 text-green-600'
    }`}>
      {isFocus ? '🍅 집중 시간' : '☕ 휴식 시간'}
    </span>
  )
}