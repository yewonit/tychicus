import environments from '@/config/environments';
import store from '@/store';
import axios from 'axios';

// API 기본 URL 설정
const API_BASE_URL = environments.API_BASE_URL;
const AUTH_BASE_URL = environments.AUTH_BASE_URL;

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const auth = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 모든 요청에 인증 토큰 추가
api.interceptors.request.use(
  (config) => {
    const accessToken = store.getters['auth/userAccessToken'];
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 등의 에러 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 재시도하지 않은 요청일 경우 토큰 갱신 시도
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // 리프레시 토큰으로 새 액세스 토큰 요청
        const refreshToken = store.getters['auth/userRefreshToken'];
        if (!refreshToken) {
          // 리프레시 토큰이 없으면 로그아웃 처리
          await store.dispatch('auth/logout');
          return Promise.reject(error);
        }

        // 토큰 갱신 요청 (일반 axios 사용, 인터셉터 무한 루프 방지)
        const response = await auth.post(`/auth/refresh`, {
          refreshToken,
        });

        // 새 토큰 저장
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        await store.dispatch('auth/setAccessToken', accessToken);
        await store.dispatch('auth/setRefreshToken', newRefreshToken);

        // 새 토큰으로 원래 요청 재시도
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return auth(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신에 실패하면 로그아웃
        await store.dispatch('auth/logout');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default { api, auth };
