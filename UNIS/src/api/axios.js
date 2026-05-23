import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  withCredentials: true,
});

// 요청 인터셉터 — 헤더에 uuid 자동 주입
api.interceptors.request.use(
  (config) => {
    const uuid = localStorage.getItem('user_uuid');
    if (uuid) {
      config.headers['uuid'] = uuid;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 — 공통 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
