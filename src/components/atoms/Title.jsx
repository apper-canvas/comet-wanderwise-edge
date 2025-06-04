import React from 'react';

const Title = ({ children, level, className = '' }) => {
  const Tag = `h${level}`;
  return (
    <Tag className={`font-heading font-bold text-surface-900 dark:text-white ${className}`}>
      {children}
    </Tag>
  );
};

export default Title;