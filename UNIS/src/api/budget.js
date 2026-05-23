import api from './axios'

/** GET /budgets/monthly?userId=&yearMonth= */
export const getMonthlyBudget = (userId, yearMonth) =>
  api.get('/budgets/monthly', { params: { userId, yearMonth } })

/** POST /budgets/monthly */
export const createMonthlyBudget = (data) =>
  api.post('/budgets/monthly', data)

/** PATCH /budgets/monthly/:monthlyBudgetId */
export const updateMonthlyBudget = (monthlyBudgetId, data) =>
  api.patch(`/budgets/monthly/${monthlyBudgetId}`, data)
