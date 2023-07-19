import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSeller } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
        const data = await loginSeller(email, password);
        // Assuming the backend returns a success status, token, and sellerId upon successful login
        if (data.token && data.sellerId) {
          // Navigate to the dashboard page with the sellerId in the URL
          localStorage.setItem('token', data.token);
          localStorage.setItem('sellerId', data.sellerId);
          navigate(`/seller/${data.sellerId}/dashboard`);}
    } catch (error) {
      // Handle error and display error message
      setErrorMessage(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {errorMessage && <div className="alert">{errorMessage}</div>}
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <br /><br /><br />
      <a href="/seller/register">register</a><br />
      <a href="/seller">back</a>
    </div>
  );
};

export default Login;
