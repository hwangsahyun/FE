export default function Controls({ isRunning, onStart, onPause, onReset }) {
  return (
    <div className="flex gap-4 mt-8">
      {isRunning ? (
        <button
          onClick={onPause}
          className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 font-medium transition"
        >
          일시정지
        </button>
      ) : (
        <button
          onClick={onStart}
          className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium transition"
        >
          시작
        </button>
      )}
      <button
        onClick={onReset}
        className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-100 font-medium transition"
      >
        리셋
      </button>
    </div>
  )
}