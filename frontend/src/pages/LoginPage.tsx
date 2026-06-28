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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login({ email, password });
    navigate('/chat');
  };

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>로그인</h1>
        <Input onChange={(event) => setEmail(event.target.value)} placeholder="이메일" type="email" value={email} />
        <Input
          onChange={(event) => setPassword(event.target.value)}
          placeholder="비밀번호"
          type="password"
          value={password}
        />
        <Button disabled={isLoading} type="submit">
          로그인
        </Button>
        <Link to="/register">회원가입</Link>
      </form>
    </main>
  );
}

export default LoginPage;
