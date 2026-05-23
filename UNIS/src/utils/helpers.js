/** localStorage에서 userId를 숫자로 반환 */
export const getUserId = () => {
  const id = localStorage.getItem('user_id')
  return id ? Number(id) : null
}

/** 현재 월을 "YYYY-MM" 형식으로 반환 */
export const getCurrentYearMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

/** "YYYY-MM" 기준으로 n개월 전 yearMonth 반환 */
export const getRelativeYearMonth = (yearMonth, offset) => {
  const [y, m] = yearMonth.split('-').map(Number)
  const date = new Date(y, m - 1 + offset, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}
