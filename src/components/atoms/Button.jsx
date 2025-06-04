import React from 'react';

const Button = ({ children, onClick, className = '', variant = 'primary', type = 'button', icon: Icon, iconClass = '' }) => {
  const baseClasses = 'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark',
    ghost: 'bg-transparent text-primary hover:bg-primary/10',
    outline: 'border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700',
    card: 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {Icon && <Icon className={`w-4 h-4 ${iconClass}`} />}
      <span>{children}</span>
    </button>
  );
};

export default Button;