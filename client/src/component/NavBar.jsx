import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useEmployee } from '../context/employee';
import { Link } from 'react-router-dom';
import './components.styles.css'

export default function NavBar() {
    const { user, logout } = useEmployee();
    const [userId, setUserId] = useState(""); 

    const location = useLocation();

    useEffect(() => {
        if (user) {
            setUserId(user._id);
            console.log(userId); 
        }
    }, [user, userId]);
    

    const renderBackButton = () => {
        if (location.pathname !== '/' || location.pathname !== '/home') {
            return (
                <button onClick={() => window.history.back()}>Back</button>
            );
        }
        return null;
    };

    const handleLogout = () => {
        logout()
    }

    return (
        <nav className='nav_bar'>
            <div className='nav_items'>
                <div style={{display: "flex", gap: "1rem", alignItems: "center"}}>
                    {renderBackButton()}
                    {user ? (
                        <p className='welcome_message'>Welcome {user.name}</p>
                    ) : (
                        <p>Welcome</p>
                    )}
                </div>
                { user && user.isAdmin && location.pathname !== "/home" ?  (
                    <>
                        <Link to="/home" className='nav_link'>Home</Link>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : user && location.pathname !== "/home" ? (  
                    <>
                        <Link to="/home" className='nav_link'>Home</Link>
                        <button onClick={logout}>Logout</button>
                    </>
                ): user && (
                    <button onClick={handleLogout}>Logout</button>
                )
            }
            </div>
        </nav>
    );
}
