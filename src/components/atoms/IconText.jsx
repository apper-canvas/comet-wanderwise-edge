import React from 'react';
import ApperIcon from '../ApperIcon';

const IconText = ({ icon, text, className = '', iconClass = '' }) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <ApperIcon name={icon} className={`w-4 h-4 ${iconClass}`} />
      <span>{text}</span>
    </div>
  );
};

export default IconText;