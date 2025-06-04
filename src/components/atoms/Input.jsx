import React from 'react';

const Input = ({ type = 'text', placeholder, value, onChange, className = '', icon: Icon, required = false, min, step }) => {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-surface-700 ${Icon ? 'pl-10 pr-4' : ''} ${className}`}
        required={required}
        min={min}
        step={step}
      />
    </div>
  );
};

export default Input;