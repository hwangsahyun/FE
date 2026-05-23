import api from './axios'

/** GET /characters/me?userId= */
export const getCharacter = (userId) =>
  api.get('/characters/me', { params: { userId } })
