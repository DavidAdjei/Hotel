import React, { useState } from 'react';
import { useAdmin } from '../../context/admin';
import Pagination from '../../component/Pagination';
import SideMenu from '../../component/SideMenu';
import { useNavigate } from 'react-router-dom';

function AllEmployees() {
  const { employees, makeAdmin, removeAdmin } = useAdmin();
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(15);
  const navigate = useNavigate()

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleLogsClick = (id) => {
    navigate(`/admin/logs/${id}`)
  }


  return (
    <div className='admin-container'>
      <SideMenu/>
      <div className='admin-right'>
       <h2>All Employees</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Salary</th>
              <th>Phone Number</th>
              <th>Action</th>
              <th>Logs</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map(employee => (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>GH₵{employee.employeeDetails.salary}</td>
                <td>{employee.phone}</td>
                {employee.isAdmin ? (
                  <td><button onClick={()=> removeAdmin(employee._id)}>Remove Admin</button></td>
                ) : (
                  <td><button onClick={()=> makeAdmin(employee._id)}>Make Admin</button></td>
                )}
                <td><button onClick={() => handleLogsClick(employee._id)}>Logs</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <Pagination
          itemsPerPage={employeesPerPage}
          totalItems={employees.length}
          paginate={paginate}
        />  */}
      </div>
      
    </div>
  );
};

export default AllEmployees;
