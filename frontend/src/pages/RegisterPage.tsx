import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';

function RegisterPage() {
  const navigate = useNavigate();
  const { isLoading, register } = useAuth();
  
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  
  // 개별 필드 에러 상태 관리
  const [errors, setErrors] = useState({
    email: '',
    nickname: '',
    password: '',
    global: '',
  });

  // 유효성 검사 함수
  const validateForm = (): boolean => {
    const newErrors = { email: '', nickname: '', password: '', global: '' };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
      isValid = false;
    }

    if (!nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요.';
      isValid = false;
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요.';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자리 이상이어야 합니다.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // 1. 클라이언트 사이드 유효성 검사 실행
    if (!validateForm()) return;

    try {
      // 2. 비동기 요청을 try-catch로 안전하게 처리
      await register({ email, nickname, password });
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error) {
      console.error('회원가입 페이지 에러 핸들링:', error);
      // 3. 서버 측 에러 대응 (이미 존재하는 이메일 등)
      setErrors((prev) => ({
        ...prev,
        global: '이미 등록된 이메일이거나 가입에 실패했습니다.',
      }));
    }
  };

  const isFormEmpty = !email.trim() || !nickname.trim() || !password;

  return (
    <main className="auth-page" style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
      <form 
        className="auth-form" 
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '400px', padding: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>회원가입</h1>
        
        {/* 4. 이전에 구현한 공통 Input의 label 및 errorMessage 적용 */}
        <Input 
          label="이메일 주소"
          onChange={(event) => setEmail(event.target.value)} 
          placeholder="example@email.com" 
          type="email" 
          value={email} 
          disabled={isLoading}
          errorMessage={errors.email}
        />
        
        <Input 
          label="닉네임"
          onChange={(event) => setNickname(event.target.value)} 
          placeholder="서비스에서 사용할 이름" 
          value={nickname} 
          disabled={isLoading}
          errorMessage={errors.nickname}
        />
        
        <Input
          label="비밀번호"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="6자리 이상의 비밀번호"
          type="password"
          value={password}
          disabled={isLoading}
          errorMessage={errors.password}
        />

        {/* 서버 실패 등 글로벌 에러 메시지 바 */}
        {errors.global && (
          <div style={{ color: '#dc3545', fontSize: '14px', textAlign: 'center', backgroundColor: '#fdf2f2', padding: '8px', borderRadius: '4px' }}>
            {errors.global}
          </div>
        )}

        <Button disabled={isLoading || isFormEmpty} type="submit" variant="primary">
          {isLoading ? '가입 진행 중...' : '가입하기'}
        </Button>
        
        <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px' }}>
          <span style={{ color: '#64748b' }}>이미 계정이 있으신가요? </span>
          <Link to="/login" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: '600' }}>
            로그인
          </Link>
        </div>
      </form>
    </main>
  );
}

export default RegisterPage;