const RADIUS = 90
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ProgressRing({ progress, isFocus, children }) {
  const offset = CIRCUMFERENCE * (1 - progress)

  return (
    <div className="relative flex items-center justify-center w-56 h-56">
      <svg className="absolute" width="224" height="224" viewBox="0 0 224 224">
        <circle
          cx="112" cy="112" r={RADIUS}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <circle
          cx="112" cy="112" r={RADIUS}
          fill="none"
          stroke={isFocus ? '#ef4444' : '#22c55e'}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 112 112)"
          style={{ transition: 'stroke-dashoffset 0.8s linear' }}
        />
      </svg>
      <div className="z-10">{children}</div>
    </div>
  )
}