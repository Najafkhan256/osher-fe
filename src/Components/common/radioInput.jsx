import React from 'react';

const RadioInput = ({ order, currentOffer, handleChange }) => {
  return (
    <div className='form-check'>
      <input
        className='form-check-input'
        type='radio'
        name='offer'
        id={order.price}
        value={order.price}
        checked={currentOffer === order.price}
        onChange={handleChange}
      />
      <label className='form-check-label' htmlFor={order.price}>
        <p>{order.offerDetails}</p>
        <div className='pricebox'>
          <h5>${order.price}</h5>
        </div>
      </label>
      <div className='linee'></div>
    </div>
  );
};

export default RadioInput;
