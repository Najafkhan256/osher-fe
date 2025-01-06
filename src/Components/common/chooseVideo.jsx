import React from 'react';

const ChooseVideo = ({ label, data: users, handleChange, def ,...rest}) => {
  return (
    <div className='choose-brand'>
      <label htmlFor=''>{label}</label>
      <select name='brand' {...rest} onChange={handleChange} className='form-control'>
        {def && <option value=''>All Brands</option>}
        {users
          .map((option) => (
            <option key={option._id} value={option._id}>
              {option.name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default ChooseVideo;
