import React from 'react';

const TextArea = ({ name, label, error, placeholder, ...rest }) => {
  return (
    <div className='form-group'>
      <textarea
        {...rest}
        name={name}
        id={name}
        placeholder={placeholder}
        className=''
      />
      {error && <div className='alert alert-danger'>{error}</div>}
    </div>
  );
};

export default TextArea;
