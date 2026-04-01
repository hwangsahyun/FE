import { useTimer } from './hooks/useTimer'

export default function App() {
  const { timeLeft, isRunning, isFocus, sessions, start, pause, reset, formatTime } = useTimer()

  const progress = !isRunning && timeLeft === (isFocus ? 25 * 60 : 5 * 60)
    ? 0
    : isFocus
      ? 1 - timeLeft / (25 * 60)
      : 1 - timeLeft / (5 * 60)

  const x = 118, y = 183, w = 333, h = 119, r = 12, pad = 5
  const perimeter = 2 * (w + h) - (2 - Math.PI / 2) * 8 * r
  const offset = progress === 0 ? perimeter : perimeter * (1 - progress)

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div
        className="min-h-screen flex items-center justify-center bg-transparent"
        style={{ WebkitAppRegion: 'drag' }}
      ></div>
      <div className="relative" style={{ width: '576px', height: '551px', fontFamily: 'Pretendard, sans-serif' }}>

        {/* 토마토 이미지 */}
        <img src="/tomato.png" alt="tomato" className="absolute inset-0 w-full h-full" />

        {/* SVG 레이어 — 진행 중일 때만 노란 링 표시 */}
        <svg className="absolute inset-0" width="576" height="551" viewBox="0 0 576 551" fill="none" style={{ zIndex: 2 }}>
  {(() => {
    const x = 113, y = 178, w = 343, h = 129, r = 17
    // 왼쪽 상단 꼭짓점에서 시계방향으로 그리는 path
    const d = `
      M ${x + r} ${y}
      L ${x + w - r} ${y}
      Q ${x + w} ${y} ${x + w} ${y + r}
      L ${x + w} ${y + h - r}
      Q ${x + w} ${y + h} ${x + w - r} ${y + h}
      L ${x + r} ${y + h}
      Q ${x} ${y + h} ${x} ${y + h - r}
      L ${x} ${y + r}
      Q ${x} ${y} ${x + r} ${y}
      Z
    `
    // pathLength를 1000으로 고정해서 퍼센트로 제어
    const pathLength = 1000
    const dashoffset = progress === 0 ? pathLength : pathLength * (1 - progress)
    return (
      <>
        {progress > 0 && (
          <path
            d={d}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="8"
            fill="none"
            pathLength={pathLength}
          />
        )}
        {progress > 0 && (
          <path
            d={d}
            stroke="#FFF200"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            pathLength={pathLength}
            strokeDasharray={pathLength}
            strokeDashoffset={dashoffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        )}
      </>
    )
  })()}
</svg>

        {/* Time Display 박스 */}
        <div
          className="absolute"
          style={{
            left: '118px', top: '183px',
            width: '333px', height: '119px',
            background: '#F0FFE3',
            borderRadius: '12px',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: '6px 12px 8px',
          }}
        >
          <div style={{
            background: '#CDE4BA',
            borderRadius: '5px',
            padding: '2px 8px',
            fontSize: '13px',
            fontWeight: '700',
            color: '#486D22',
            marginBottom: '2px',
            lineHeight: 1.4,
          }}>
            💦 {sessions} th Session
          </div>
          {/* 시간 텍스트 */}
<div style={{
  fontSize: '64px',
  fontWeight: '800',
  color: '#486D22',
  lineHeight: 1,
  letterSpacing: '2px',
  width: '100%',
  textAlign: 'center',
  marginTop: '6px',  // 이 줄 추가
}}>
  {formatTime(timeLeft)}
</div>
        </div>

        {/* START/PAUSE: X=235, Y=338 */}
        <div className="absolute" style={{ left: '235px', top: '338px', zIndex: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button onClick={isRunning ? pause : start} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              {isRunning ? (
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                  <g filter="url(#pause_sh)">
                    <circle cx="50" cy="50" r="50" fill="#51921A"/>
                  </g>
                  <rect x="28" y="28" width="14" height="44" rx="4" fill="#486D22"/>
                  <rect x="58" y="28" width="14" height="44" rx="4" fill="#486D22"/>
                  <defs>
                    <filter id="pause_sh" x="0" y="0" width="102" height="104" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_innerShadow"/>
                      <feOffset dx="2" dy="4"/>
                      <feGaussianBlur stdDeviation="2.5"/>
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
                      <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
                    </filter>
                  </defs>
                </svg>
              ) : (
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                  <g filter="url(#filter0_i_4_45)">
                    <circle cx="50" cy="50" r="50" fill="#51921A"/>
                  </g>
                  <path d="M74.3536 48.6533C77.7256 50.5701 77.7256 55.4299 74.3536 57.3467L40.721 76.4658C37.3878 78.3606 33.25 75.9532 33.25 72.119L33.25 33.8809C33.25 30.0468 37.3878 27.6394 40.721 29.5342L74.3536 48.6533Z" fill="#486D22"/>
                  <defs>
                    <filter id="filter0_i_4_45" x="0" y="0" width="102" height="104" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_innerShadow_4_45"/>
                      <feOffset dx="2" dy="4"/>
                      <feGaussianBlur stdDeviation="2.5"/>
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
                      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_4_45"/>
                    </filter>
                  </defs>
                </svg>
              )}
            </button>
            <span style={{ color: '#fff', fontSize: '15px', fontWeight: '700', marginTop: '6px', letterSpacing: '0.05em' }}>
              {isRunning ? 'PAUSE' : 'START'}
            </span>
          </div>
        </div>

        {/* RESET: X=133, Y=353 */}
        <div className="absolute" style={{ left: '133px', top: '353px', zIndex: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button onClick={reset} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
                <g filter="url(#filter0_i_4_44)">
                  <circle cx="35" cy="35" r="35" fill="#51921A"/>
                </g>
                <path fillRule="evenodd" clipRule="evenodd" d="M31.3186 20.9241L27.5605 17.126L30.6558 14L39.163 22.5998C39.3673 22.807 39.4821 23.0877 39.4821 23.3802C39.4821 23.6728 39.3673 23.9534 39.163 24.1606L30.6536 32.7604L27.5627 29.63L31.8195 25.3279C28.9602 25.9303 26.3814 27.4793 24.4914 29.7298C22.6014 31.9803 21.5082 34.8036 21.3848 37.7528C21.2613 40.702 22.1148 43.6085 23.8101 46.0122C25.5054 48.4159 27.9455 50.1795 30.7443 51.0237C33.5431 51.8679 36.5405 51.7445 39.2621 50.6731C41.9836 49.6017 44.2738 47.6434 45.7701 45.1083C47.2663 42.5732 47.8831 39.6062 47.5228 36.6769C47.1624 33.7477 45.8456 31.0235 43.7808 28.9358L46.8761 25.8098C49.6416 28.6056 51.4006 32.2571 51.8723 36.1814C52.3439 40.1058 51.501 44.0767 49.4782 47.4603C47.4553 50.8438 44.3691 53.4448 40.7122 54.8482C37.0553 56.2515 33.0387 56.3761 29.3035 55.2023C25.5683 54.0284 22.3299 51.6236 20.1054 48.3719C17.8809 45.1202 16.7985 41.2091 17.0309 37.2629C17.2634 33.3167 18.7974 29.5629 21.388 26.6009C23.9785 23.639 27.4764 21.6395 31.323 20.9219L31.3186 20.9241Z" fill="#486D22"/>
                <defs>
                  <filter id="filter0_i_4_44" x="0" y="0" width="72" height="74" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_innerShadow_4_44"/>
                    <feOffset dx="2" dy="4"/>
                    <feGaussianBlur stdDeviation="2.5"/>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_4_44"/>
                  </filter>
                </defs>
              </svg>
            </button>
            <span style={{ color: '#fff', fontSize: '15px', fontWeight: '700', marginTop: '6px', letterSpacing: '0.05em' }}>RESET</span>
          </div>
        </div>

        {/* LAP: X=367, Y=353 */}
        <div className="absolute" style={{ left: '367px', top: '353px', zIndex: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
                <g filter="url(#filter0_i_4_46)">
                  <circle cx="35" cy="35" r="35" fill="#51921A"/>
                </g>
                <path d="M39.5001 24.5007L45.5001 30.5008M48.7612 27.2187C49.5542 26.4259 49.9999 25.3504 50 24.2289C50.0001 23.1075 49.5548 22.0319 48.7619 21.2388C47.969 20.4458 46.8936 20.0001 45.7722 20C44.6507 19.9999 43.5752 20.4452 42.7821 21.2381L22.7629 41.2621C22.4147 41.6093 22.1571 42.0369 22.0129 42.5071L20.0314 49.0352C19.9926 49.165 19.9897 49.3028 20.0229 49.434C20.0562 49.5653 20.1243 49.6851 20.2201 49.7808C20.3159 49.8764 20.4358 49.9444 20.5671 49.9774C20.6985 50.0104 20.8362 50.0072 20.9659 49.9683L27.4955 47.9882C27.9652 47.8453 28.3927 47.5893 28.7405 47.2427L48.7612 27.2187Z" stroke="#486D22" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <filter id="filter0_i_4_46" x="0" y="0" width="72" height="74" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_innerShadow_4_46"/>
                    <feOffset dx="2" dy="4"/>
                    <feGaussianBlur stdDeviation="2.5"/>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_4_46"/>
                  </filter>
                </defs>
              </svg>
            </button>
            <span style={{ color: '#fff', fontSize: '15px', fontWeight: '700', marginTop: '6px', letterSpacing: '0.05em' }}>LAP</span>
          </div>
        </div>

      </div>
    </div>
  )
}