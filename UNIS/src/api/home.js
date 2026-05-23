import api from './axios'

/** GET /home?userId=&yearMonth= */
export const getHome = (userId, yearMonth) =>
  api.get('/home', { params: { userId, yearMonth } })
