import api from './axios'

/** GET /reports/weekly?userId= */
export const getWeeklyReport = (userId) =>
  api.get('/reports/weekly', { params: { userId } })

/** GET /reports/monthly?userId=&yearMonth= */
export const getMonthlyReport = (userId, yearMonth) =>
  api.get('/reports/monthly', { params: { userId, yearMonth } })
