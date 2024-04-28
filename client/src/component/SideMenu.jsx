import React from 'react'
import {Link} from 'react-router-dom'

export default function SideMenu() {
  return (
    <div className="admin-navigation">
        <h2>Admin Dashboard</h2>
        <nav>
          <ul>
            <li>
              <Link to='/admin'>Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/add-employee">Add Employee</Link>
            </li>
            <li>
              <Link to="/admin/add-item">Add Item</Link>
            </li>
            <li>
              <Link to="/admin/all-employees">All Employees</Link>
            </li>
            <li>
              <Link to="/admin/all-clients">All Clients</Link>
            </li>
            <li>
              <Link to="/all-items">All Items</Link>
            </li>
            <li>
              <Link to="/admin/add-dish">Add Dish</Link>
            </li>
            <li>
              <Link to="/admin/view-orders">View Orders</Link>
            </li>
            <li>
              <Link to="/admin/feedbacks">View Feedbacks</Link>
            </li>
          </ul>
      </nav>
    </div>
  )
}
