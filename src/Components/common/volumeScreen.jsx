import React from 'react';

const VolumeScreen = ({ role, value }) => {
  return (
    <div className='volume-screen'>
      <div className='volume-box'>
        <i
          className={
            role === 'mute' ? 'fas fa-volume-mute' : 'fas fa-volume-up'
          }
        ></i>

        {value && (
          <div className='vol-value'>
            <div style={{ width: `${value * 100}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolumeScreen;
