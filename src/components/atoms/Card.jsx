import React from 'react';

const Card = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-white dark:bg-surface-800 rounded-xl shadow-card ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;