import React, { useState } from 'react';
import { useEmployee } from '../context/employee';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useEmployee();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email || !password) {
        console.log("Please fill all fields");
        return;
      } else {
          login(email, password, setError)
      }
    
  };

  return (
    <div className='main' style={{alignItems: "normal", justifyContent: 'normal'}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && (
          <p className='error'>{ error }</p>
        )}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
