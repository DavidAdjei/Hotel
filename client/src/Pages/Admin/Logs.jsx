import React, { useEffect, useState } from 'react';
import SideMenu from '../../component/SideMenu';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Logs() {
  const { employeeId } = useParams();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      axios.get(`/getLogs/${employeeId}`)
        .then(response => {
          if (!response.data.error) {
            setLogs(response.data.logs)
          } else {
            console.log(response.data.error)
          }
        })
        .catch(err => {
          console.log(err)
        })
    };
    fetchLogs();
  }, [employeeId]);

  const formatDate = (dt) => {
        const date = new Date(dt);
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        return formattedDate;
    }

  // Function to group logs by date with login and logout times
  const groupByDate = () => {
    const groupedLogs = {};
    logs.forEach(log => {
      const date = formatDate(log.timestamp);
      if (!groupedLogs[date]) {
        groupedLogs[date] = {
          logintime: null,
          logouttime: null
        };
      }
      if (log.type === 'login') {
        groupedLogs[date].logintime = new Date(log.timestamp).toLocaleTimeString();
      } else if (log.type === 'logout') {
        groupedLogs[date].logouttime = new Date(log.timestamp).toLocaleTimeString();
      }
    });
    return groupedLogs;
  };

  return (
    <div className='admin-container'>
      <SideMenu />
      <div className='admin-right'>
        <h2>Logs</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Login Time</th>
              <th>Logout Time</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupByDate()).map(([date, times], index) => (
              <tr key={index}>
                <td>{date}</td>
                <td>{times.logintime}</td>
                <td>{times.logouttime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logs;
