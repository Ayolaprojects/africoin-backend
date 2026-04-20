import React from 'react';
import '../styles/Button.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  onClick,
  children,
  disabled = false,
  icon,
  className = '',
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
