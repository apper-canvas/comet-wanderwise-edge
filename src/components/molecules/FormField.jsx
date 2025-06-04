import React from 'react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';
import Select from '../atoms/Select';

const FormField = ({ label, type = 'text', value, onChange, placeholder, icon, required, min, step, options, className = '' }) => {
  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      {type === 'select' ? (
        <Select
          value={value}
          onChange={onChange}
          options={options}
        />
      ) : (
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          icon={icon}
          required={required}
          min={min}
          step={step}
        />
      )}
    </div>
  );
};

export default FormField;