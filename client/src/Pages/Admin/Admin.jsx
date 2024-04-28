import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css'; 
import { useEmployee } from '../../context/employee';
import { useAdmin } from '../../context/admin';
import SideMenu from '../../component/SideMenu';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { clients, fetchClients } = useEmployee();
  const { employees, items } = useAdmin();
  const [department, setDepartment] = useState('hotel')
  const navigate = useNavigate();

  const topFiveEmployees = employees.slice(0, 3);
  const topFiveClients = clients.slice(0, 3);
  const topFiveItems = items.slice(0,3)

  const handleLogsClick = (id) => {
    navigate(`/admin/logs/${id}`)
  }

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
    fetchClients(e.target.value);
  }

  useEffect(() => {
    fetchClients(department)
  },[])

  return (
    <div className="admin-container">
      <SideMenu/>
      <div className="admin-tables">
        <div className="table-section">
          <h3>Employees</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Logs</th>
              </tr>
            </thead>
            <tbody>
              {topFiveEmployees.map(employee => (
                <tr key={employee._id}>
                  <td>{employee.name}</td>
                  <td><button onClick={() => handleLogsClick(employee._id)}>Logs</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/admin/all-employees">See More...</Link>
        </div>
        <div className="table-section">
          <div className='table-section__header' style={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3>Clients { department === 'hotel' ? 'For Hotel' : department === 'swimmingPool' && 'For Swimming Pool' }</h3>
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
              </tr>
            </thead>
            <tbody>
              {topFiveClients.map((client, index) => (
                <tr key={index}>
                  <td>{client.name}</td>
                  <td>{client.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/admin/all-clients">See More...</Link>
        </div>
        <div className="table-section">
          <h3>Items</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {topFiveItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.stockQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/all-items">See More...</Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;
