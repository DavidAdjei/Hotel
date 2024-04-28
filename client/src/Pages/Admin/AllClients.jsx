import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useEmployee } from '../../context/employee';
import SideMenu from '../../component/SideMenu';
axios.defaults.baseURL = 'http://localhost:8000';

const AllClients = () => {
  const { clients, fetchClients } = useEmployee();
  const [department, setDepartment] = useState('hotel')

  useEffect(() => {
    fetchClients(department)
  })


  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
    fetchClients(e.target.value);
  }

  return (
    <div className='admin-container'>
      <SideMenu/>
      <div className='admin-right'>
        <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2>All Clients { department === 'hotel' ? 'For Hotel' : department === 'swimmingPool' && 'For Swimming Pool' }</h2>
            <select name="department" id="department" value={department} onChange={handleDepartmentChange}>
              <option value="hotel">Hotel</option>
              <option value="swimmingPool">Swimming Pool</option>
            </select>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Check Ins</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id}>
                <td>{client.name}</td>
                <td>{client.phone}</td>
                <td>{client.history.length}</td>
                <td>{client.isCheckedIn ? 'Checked In' : 'Not Checked In'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default AllClients;