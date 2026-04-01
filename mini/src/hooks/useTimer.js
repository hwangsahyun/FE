import { useState, useEffect, useRef } from 'react'

const FOCUS_TIME = 25 * 60
const BREAK_TIME = 5 * 60

export function useTimer() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [isFocus, setIsFocus] = useState(true)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            if (isFocus) setSessions(s => s + 1)
            setIsFocus(f => !f)
            return isFocus ? BREAK_TIME : FOCUS_TIME
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, isFocus])

  const start = () => setIsRunning(true)
  const pause = () => setIsRunning(false)
  const reset = () => {
    setIsRunning(false)
    setTimeLeft(isFocus ? FOCUS_TIME : BREAK_TIME)
  }

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  const progress = 1 - timeLeft / (isFocus ? FOCUS_TIME : BREAK_TIME)

  return { timeLeft, isRunning, isFocus, sessions, progress, start, pause, reset, formatTime }
}