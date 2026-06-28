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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await register({ email, nickname, password });
    navigate('/login');
  };

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>회원가입</h1>
        <Input onChange={(event) => setEmail(event.target.value)} placeholder="이메일" type="email" value={email} />
        <Input onChange={(event) => setNickname(event.target.value)} placeholder="닉네임" value={nickname} />
        <Input
          onChange={(event) => setPassword(event.target.value)}
          placeholder="비밀번호"
          type="password"
          value={password}
        />
        <Button disabled={isLoading} type="submit">
          가입하기
        </Button>
        <Link to="/login">로그인</Link>
      </form>
    </main>
  );
}

export default RegisterPage;
