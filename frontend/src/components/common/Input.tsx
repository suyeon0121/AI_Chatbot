import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

function Input(props: InputProps) {
  return <input className="input" {...props} />;
}

export default Input;
