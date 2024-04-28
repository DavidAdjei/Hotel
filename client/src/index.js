import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router} from 'react-router-dom';
import { EmployeeProvider } from './context/employee';
import { AdminProvider } from './context/admin';
import { RestaurantProvider } from './context/restaurant';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <AdminProvider>
        <EmployeeProvider>
          <RestaurantProvider>
            <App />
          </RestaurantProvider>
        </EmployeeProvider> 
      </AdminProvider>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
