import api from './axios'

/** GET /expenses?userId=&yearMonth= */
export const getExpenses = (userId, yearMonth) =>
  api.get('/expenses', { params: { userId, yearMonth } })

/** POST /expenses */
export const createExpense = (data) =>
  api.post('/expenses', data)
