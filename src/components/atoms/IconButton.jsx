import React from 'react';
import ApperIcon from '../ApperIcon';

const IconButton = ({ icon, onClick, className = '', iconClass = '', label = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors ${className}`}
      aria-label={label}
    >
      <ApperIcon name={icon} className={`w-5 h-5 ${iconClass}`} />
    </button>
  );
};

export default IconButton;