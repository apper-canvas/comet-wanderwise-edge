import React from 'react';

const ProgressBar = ({ progress, className = '' }) => {
  return (
    <div className={`w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3 mb-2 ${className}`}>
      <div
        className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;