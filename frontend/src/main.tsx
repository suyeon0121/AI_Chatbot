import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

// 1. DOM 원소를 안전하게 찾아오고 타입 단언(!) 대신 방어 코드 작성
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('최상단 루트 엘리먼트(#root)를 찾을 수 없습니다. index.html 파일의 id를 확인해주세요.');
}

// 2. 안전하게 렌더링 시작
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 추후 전역 상태 관리(Zustand, QueryClientProvider 등)가 필요하다면 
        BrowserRouter 안팎을 Provider 컴포넌트로 감싸주기에 가장 좋은 위치입니다.
      */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);