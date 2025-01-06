import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import auth from '../services/authService';

const LogoutDriver = () => {

  if (!auth.getCurrentUser()) return <Redirect to='/' />;
  
    return (
    <div className='main-background'>
      <div className='logout-driver'>
        <h3>Are you sure to logout?</h3>
        <Link to='/logout'>
          <button>Yes, Logout!</button>
        </Link>

        <Link to='/'>
          <button>No, Go Back!</button>
        </Link>
      </div>
    </div>
  );
};

export default LogoutDriver;
