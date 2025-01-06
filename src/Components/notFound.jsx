import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
   return (
    <div className='main-background'>
      <div className='qr-page'>
        <h1>Page you're looking for, not found!</h1>
        <Link to='/main'>
          <button>Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
