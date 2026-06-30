import { Navigate, Route, Routes } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Spinner from './components/common/Spinner'; // 이전에 만든 Spinner 활용
import { useAuth } from './hooks/useAuth';

// 1. 로그인한 유저만 진입할 수 있도록 보호하는 컴포넌트
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // 로그인하지 않은 경우 로그인 페이지로 튕겨내고, 로그인 성공 시 원래 가려던 곳으로 되돌아오게 state 저장 가능
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// 2. 이미 로그인한 유저가 로그인/회원가입 페이지에 접근하는 것을 막는 컴포넌트
function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // 이미 로그인했다면 채팅 페이지로 리다이렉트
  return !isAuthenticated ? children : <Navigate to="/chat" replace />;
}

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* 첫 진입 시 로그인 화면을 먼저 보여줍니다. */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 비인증 유저 전용 라우트 (이미 로그인한 사람은 접근 불가) */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />

        {/* 인증 유저 전용 라우트 (로그인 필수) */}
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } 
        />

        {/* 잘못된 경로 처리 (404 Fallback) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
