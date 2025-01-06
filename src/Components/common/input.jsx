import React from 'react';

const Input = ({ name, label, error, placeholder, ...rest }) => {
  return (
    <div className='form-group' style={{ width: '100%'}}>
      <input
        {...rest}
        name={name}
        id={name}
        placeholder={placeholder}
        className='form-control'
      />
      {error && <div className='warning-red alert alert-danger'>{error}</div>}
    </div>
  );
};

export default Input;
