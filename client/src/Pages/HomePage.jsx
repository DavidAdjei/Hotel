import React from 'react';
import { Link } from 'react-router-dom';
import { useEmployee } from '../context/employee';

export default function HomePage() {
  const { user } = useEmployee();
  return (
    <div className='main_home'>
      <div className='homepage'>
        <h2 style={{color: 'white'}}>Choose Your Department</h2>
        <Link to='/clients/hotel'>Hotel</Link>
        <Link to='/restaurant'>Restaurant</Link>
        <Link to='/clients/swimmingPool'>Swimming Pool</Link>
        {
          user.isAdmin && <Link to='/admin'>Admin</Link>
        }
      </div> 
    </div>
  )
}
