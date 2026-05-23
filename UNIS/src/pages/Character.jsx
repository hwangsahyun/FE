import { useState, useEffect } from 'react'
import { getCharacter } from '../api/character'
import { getUserId } from '../utils/helpers'

function Character() {
  const userId = getUserId()
  const [character, setCharacter] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    getCharacter(userId)
      .then((res) => {
        setCharacter(res.data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [userId])

  if (loading) {
    return (
      <div className="p-4 pb-24 flex items-center justify-center min-h-[80vh]">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    )
  }

  if (!character) {
    return (
      <div className="p-4 pb-24 flex items-center justify-center min-h-[80vh]">
        <p className="text-gray-400 text-sm">캐릭터 정보를 불러올 수 없어요.</p>
      </div>
    )
  }

  const xpPercent = Math.min(character.feelingXp, 100)
  const xpStage = xpPercent >= 80 ? '행복' : xpPercent >= 50 ? '보통' : '우울'
  const emoji = xpPercent >= 80 ? '🐥' : xpPercent >= 50 ? '🐣' : '🥚'

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-6">내 캐릭터</h1>

      {/* 캐릭터 메인 */}
      <div className="bg-white rounded-2xl p-6 mb-4 flex flex-col items-center">
        <div className="w-36 h-36 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <span className="text-7xl">{emoji}</span>
        </div>
        <p className="font-bold text-xl mb-1">{character.name}</p>
        <p className="text-sm text-gray-400 mb-5">현재 기분: {xpStage}</p>

        {/* 기분 경험치 */}
        <div className="w-full mb-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>기분 경험치</span>
            <span>{character.feelingXp} / 100</span>
          </div>
          <div className="bg-gray-100 rounded-full h-3">
            <div
              className="bg-blue-400 rounded-full h-3 animate-grow"
              style={{ '--target-width': `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 코인 현황 */}
      <div className="bg-white rounded-2xl p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">보유 코인</p>
            <p className="text-2xl font-bold text-yellow-500">{character.coin} 🪙</p>
          </div>
          <div className="text-right text-sm text-gray-400">
            <p>소비를 기록하면</p>
            <p>코인이 쌓여요!</p>
          </div>
        </div>
      </div>

      {/* 성장 단계 안내 */}
      <div className="bg-blue-50 rounded-2xl p-4">
        <p className="text-xs text-blue-400 font-bold mb-3">🌱 성장 단계</p>
        <div className="flex justify-around">
          {[
            { emoji: '🥚', label: '알', range: '0~49' },
            { emoji: '🐣', label: '새싹', range: '50~79' },
            { emoji: '🐥', label: '병아리', range: '80~100' },
          ].map((stage) => (
            <div
              key={stage.label}
              className={`flex flex-col items-center gap-1 ${
                (stage.label === '알' && xpPercent < 50) ||
                (stage.label === '새싹' && xpPercent >= 50 && xpPercent < 80) ||
                (stage.label === '병아리' && xpPercent >= 80)
                  ? 'opacity-100'
                  : 'opacity-30'
              }`}
            >
              <span className="text-2xl">{stage.emoji}</span>
              <p className="text-xs font-bold text-gray-600">{stage.label}</p>
              <p className="text-[10px] text-gray-400">XP {stage.range}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Character
