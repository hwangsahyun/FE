import api from './axios'

/** POST /auth/temp-login */
export const tempLogin = () => api.post('/auth/temp-login')
