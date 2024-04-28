import React, { useState } from 'react';
import { useAdmin } from '../../context/admin';
import SideMenu from '../../component/SideMenu';

function AddEmployee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [salary, setSalary] = useState('');
  const { addEmployee } = useAdmin();
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      addEmployee(name, email, password, phone, salary, setError)
    } catch (err) {
      console.log(err)
    }
    setName('')
    setEmail("")
    setPassword('')
    setPhone("")
    setSalary('')
  };

  return (
    <div className='admin-container'>
      <SideMenu />
      <div className="admin-right">
        <h2>Add Employee</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
          <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Salary" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit">Add Employee</button>
        </form>
        {error && 
          <p>{ error }</p>
        }
      </div>
    </div>
  );
}

export default AddEmployee;