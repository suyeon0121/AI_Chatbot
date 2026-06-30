import type { HTMLAttributes } from 'react';

// 스피너의 크기와 색상 테마 정의
export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerColor = 'primary' | 'white' | 'gray';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  color?: SpinnerColor;
}

function Spinner({ 
  size = 'md', 
  color = 'primary', 
  className = '', 
  ...props 
}: SpinnerProps) {
  
  // 조건부 클래스 결합 (예: spinner spinner-md spinner-primary)
  const spinnerClass = `spinner spinner-${size} spinner-${color} ${className}`.trim();

  return (
    <div 
      role="status" 
      aria-label="로딩 중" 
      className={spinnerClass} 
      {...props} 
    />
  );
}

export default Spinner;