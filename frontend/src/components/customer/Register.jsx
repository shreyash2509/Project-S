import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCustomer } from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        setErrorMessage("Passwords don't match");
        return;
      }
      const data = await registerCustomer(name, email, password);
      console.log(data);
      // Assuming the backend returns a success status or user object upon successful registration
      if (data.customer) {
        // Navigate to the login page
        console.log(data.user)
        navigate('/customer/login');
      }
    } catch (error) {
      // Handle error and display error message
      setErrorMessage(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {errorMessage && <div className="alert">{errorMessage}</div>}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
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
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>  
      <br /><br /><br />
      <a href="/customer/login">login</a><br />
      <a href="/customer">back</a>
    </div>
  );
};

export default Register;
