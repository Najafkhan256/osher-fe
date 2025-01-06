import React from 'react';

const Loader = () => {
  let delay = 0;
  let key = 989;
  const text = 'OSHER';
  const textArr = text.split('');

  return (
    <div className='loading-component'>
      <div className='loader'>
        {textArr.map((t) => (
          <h3
            key={key++}
            className='load-heading'
            style={{ animationDelay: `${(delay += 0.15)}s` }}
          >
            {t}
          </h3>
        ))}
      </div>
    </div>
  );
};

export default Loader;
