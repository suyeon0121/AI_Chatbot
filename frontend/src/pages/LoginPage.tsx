import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const navigate = useNavigate();
  const { isLoading, login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 1. 에러 메시지 통합 관리를 위한 상태 추가
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(''); // 새로운 제출 시 기존 에러 초기화

    // 간단한 클라이언트 사이드 유효성 검사 (선택)
    if (!email.trim() || !password.trim()) {
      setErrorMessage('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      // 2. 비동기 요청을 try-catch로 감싸 안전하게 처리
      await login({ email, password });
      navigate('/chat');
    } catch (error) {
      // useAuth에서 throw된 에러를 잡아 사용자 피드백으로 전환
      console.error('로그인 페이지 에러 핸들링:', error);
      setErrorMessage('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <main className="auth-page" style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
      <form 
        className="auth-form" 
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '400px', padding: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>로그인</h1>
        
        {/* 3. 이전에 개선한 공통 Input의 label 속성 적극 활용 */}
        <Input 
          label="이메일 주소"
          onChange={(event) => setEmail(event.target.value)} 
          placeholder="example@email.com" 
          type="email" 
          value={email} 
          disabled={isLoading}
        />
        
        <Input
          label="비밀번호"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="비밀번호를 입력하세요"
          type="password"
          value={password}
          disabled={isLoading}
        />

        {/* 4. 전역 에러 메시지 표시 바 */}
        {errorMessage && (
          <div style={{ color: '#dc3545', fontSize: '14px', textAlign: 'center', backgroundColor: '#fdf2f2', padding: '8px', borderRadius: '4px' }}>
            {errorMessage}
          </div>
        )}

        {/* 로딩 중일 때 버튼 텍스트 변경으로 시각적 피드백 제공 */}
        <Button disabled={isLoading || !email.trim() || !password.trim()} type="submit" variant="primary">
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>
        
        <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px' }}>
          <span style={{ color: '#64748b' }}>계정이 없으신가요? </span>
          <Link to="/register" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: '600' }}>
            회원가입
          </Link>
        </div>
      </form>
    </main>
  );
}

export default LoginPage;