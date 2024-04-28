import React, { useEffect, useState } from 'react';

function CheckIns() {
  const [checkIns, setCheckIns] = useState([]);

  useEffect(() => {
    // Fetch all check-ins from the '/checkIns' endpoint
    // Update state with the fetched data
    // Example:
    // fetch('/checkIns')
    //   .then(response => response.json())
    //   .then(data => setCheckIns(data));
  }, []);

  return (
    <div>
      <h2>All Check-Ins</h2>
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Check-In Time</th>
            {/* Add more columns if needed */}
          </tr>
        </thead>
        <tbody>
          {checkIns.map(checkIn => (
            <tr key={checkIn.id}>
              <td>{checkIn.employeeName}</td>
              <td>{checkIn.checkInTime}</td>
              {/* Add more table data for additional information */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CheckIns;