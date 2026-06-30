import axios, { AxiosHeaders, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

export const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';

function getStoredAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function removeStoredAccessToken(): void {
  try {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('토큰 제거 실패:', error);
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
  timeout: 10000, // 1. 네트워크 타임아웃 설정 (10초) 추가
  headers: {
    'Content-Type': 'application/json',
  },
});

// [요청 인터셉터]: 서버로 요청이 가기 전에 실행
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredAccessToken();

    if (token) {
      config.headers = AxiosHeaders.from(config.headers);
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. [응답 인터셉터] 추가: 서버로부터 응답을 받은 직후 공통 로직 처리
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 2xx 범위에 있는 상태 코드는 이 함수를 통과합니다.
    return response;
  },
  (error) => {
    // 2xx 외의 상태 코드가 오거나 네트워크 에러 시 이 함수가 실행됩니다.
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      // 3. 토큰 만료 또는 유효하지 않은 인증 (401 Unauthorized) 집중 처리
      if (status === 401) {
        console.warn('인증 토큰이 만료되었거나 유효하지 않습니다. 세션을 초기화합니다.');
        
        // 브라우저에 남은 유효하지 않은 토큰을 지우고 로그인 페이지로 튕겨내기
        removeStoredAccessToken();
        
        // 싱글 페이지 애플리케이션(SPA) 환경에 맞춰 리다이렉트 처리
        // 만약 react-router의 가드 로직이나 useAuth 내부에서 제어하고 있다면 
        // 여기서 이벤트를 발행하거나 그냥 아래처럼 하드웨어 이동을 유도할 수 있습니다.
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
      
      // 서버에서 내려준 커스텀 에러 메시지가 있다면 Error 객체에 주입해 서브 레이어로 전달
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        error.message = serverMessage;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;