import api from './axios'

/** GET /categories?userId= */
export const getCategories = (userId) =>
  api.get('/categories', { params: { userId } })

/** POST /categories */
export const createCategory = (data) =>
  api.post('/categories', data)
