import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

// 1. 버튼의 디자인 변형과 크기를 정의하는 타입 추가
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

function Button({ 
  children, 
  type = 'button', 
  variant = 'primary', // 기본값 설정
  size = 'md',         // 기본값 설정
  className = '',      // 외부에서 주입되는 className 대응
  ...props 
}: ButtonProps) {
  
  // 2. 조건부 클래스 네임 결합 (템플릿 리터럴 활용)
  // 프로젝트 환경에 따라 `clsx`나 `tailwind-merge` 같은 라이브러리를 쓰면 더 깔끔해집니다.
  const buttonClass = `button button-${variant} button-${size} ${className}`.trim();

  return (
    <button className={buttonClass} type={type} {...props}>
      {children}
    </button>
  );
}

export default Button;