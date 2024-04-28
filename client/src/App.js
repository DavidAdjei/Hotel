import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import ClientPage from './Pages/Clients';
import Admin from './Pages/Admin/Admin';
import AddEmployee from './Pages/Admin/AddEmployee';
import AllEmployees from './Pages/Admin/AllEmployees';
import CheckIns from './Pages/Admin/CheckIns';
import Items from './Pages/Admin/Items';
import './App.css'
import { useEmployee } from './context/employee';
import NavBar from './component/NavBar';
import AllClients from './Pages/Admin/AllClients';
import AddItem from './Pages/Admin/AddItem';
import Logs from './Pages/Admin/Logs';
import HomePage from './Pages/HomePage';
import AddDish from './Pages/Admin/AddDish';
import Restaurant from './Pages/Restaurant';
import Orders from './Pages/Admin/Orders';
import EditHistoryList from './Pages/Admin/EditHistoryList';
import Feedbacks from './Pages/Admin/Feedbacks';

const App = () => {
  const { user, loggedIn } = useEmployee();
  return (
    <div className='container'>
      <NavBar/>
      <Routes>
        <Route path='/home' element={ loggedIn ? <HomePage/> : <Navigate to='/'/> } />
        <Route exact path="/"  element={loggedIn ? <Navigate to="/home"/> : <Login/>} />
        <Route path="/clients/:department" element={loggedIn ? <ClientPage /> : <Navigate to="/" />} />
        <Route path="/restaurant" element={loggedIn ? <Restaurant/> : <Navigate to="/"/>} />
        <Route path="/admin" element={loggedIn && user.isAdmin ? <Admin /> : <Navigate to="/"/>} />
        <Route path="/admin/add-employee" element={loggedIn && user.isAdmin ? <AddEmployee /> : <Navigate to="/"/>} />
        <Route path="/admin/all-employees" element={loggedIn && user.isAdmin ? <AllEmployees /> : <Navigate to="/"/>} />
        <Route path="/admin/check-ins" element={loggedIn && user.isAdmin ? <CheckIns /> : <Navigate to="/"/>} />
        <Route path="/all-items" element={loggedIn ? <Items /> : <Navigate to="/" />} />
        <Route path="/admin/all-clients" element={loggedIn && user.isAdmin ? <AllClients /> : <Navigate to="/" />} />
        <Route path="/admin/add-item" element={loggedIn && user.isAdmin ? <AddItem /> : <Navigate to="/" />} />
        <Route path="/admin/add-dish" element={loggedIn && user.isAdmin ? <AddDish /> : <Navigate to="/" />} />
        <Route path="/admin/view-orders" element={loggedIn && user.isAdmin ? <Orders /> : <Navigate to="/" />} />
        <Route path="/admin/logs/:employeeId" element={loggedIn && user.isAdmin ? <Logs /> : <Navigate to="/" />} />
        <Route path="/admin/feedbacks" element={loggedIn && user.isAdmin ? <Feedbacks/> : <Navigate to="/" />} />
        <Route path="/admin/editHistory/:id" element={loggedIn && user.isAdmin ? <EditHistoryList/> : <Navigate to="/"/>} />
      </Routes>
    </div>
  );
};
export default App;