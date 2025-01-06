import React from 'react';

const Select = ({ def, name, label, options, error, ...rest }) => {
  return (
    <div  className='form-group'>
     {label && <label htmlFor={name}>{label}</label>}
      <select name={name} id={name} {...rest} className='form-control'>
        {def && <option value='' >
          Choose Category
        </option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <div className='alert alert-danger'>{error}</div>}
    </div>
  );
};

export default Select;
