import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
  const AuthComponent = () => {
    const navigate = useNavigate();
    useEffect(() => {
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem('token');
      if (!isLoggedIn) {
        // Redirect to login page if not logged in
        navigate('/');
      }
    }, []);

    return <WrappedComponent />;
  };

  return AuthComponent;
};

export default withAuth;
