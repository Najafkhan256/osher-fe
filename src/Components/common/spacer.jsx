import React from 'react';

const Spacer = (size) => {
  let margin =
    size === 'small' ? '20px' : size === 'medium' ? '10px' : '300px';

  return <div style={{ margin: margin, width: '100%' }}></div>;
};

export default Spacer;
