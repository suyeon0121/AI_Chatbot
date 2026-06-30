import { useId, type InputHTMLAttributes } from 'react';

// 확장할 속성 정의 (라벨과 에러 메시지 텍스트)
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
}

function Input({ 
  label, 
  errorMessage, 
  id, 
  className = '', 
  ...props 
}: InputProps) {
  // 컴포넌트 내부 고유 ID 생성 (React 18+ 기능, 스크린 리더 및 라벨 매핑용)
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  // 상태에 따른 클래스명 동적 결합
  const inputClass = `input ${errorMessage ? 'input-error' : ''} ${className}`.trim();

  return (
    <div className="input-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      {/* 1. 라벨 영역 */}
      {label && (
        <label htmlFor={inputId} className="input-label" style={{ fontWeight: '600', fontSize: '14px' }}>
          {label}
        </label>
      )}

      {/* 2. 실제 Input 엘리먼트 */}
      <input
        id={inputId}
        className={inputClass}
        aria-invalid={!!errorMessage} // 에러 여부를 스크린 리더에 알림
        aria-describedby={errorMessage ? errorId : undefined} // 에러 메시지와 매핑
        {...props}
      />

      {/* 3. 에러 메시지 영역 */}
      {errorMessage && (
        <span id={errorId} className="input-error-message" style={{ color: '#dc3545', fontSize: '12px' }}>
          {errorMessage}
        </span>
      )}
    </div>
  );
}

export default Input;