import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideMenu from '../../component/SideMenu';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('/feedbacks'); 
        setFeedbacks(response.data.feedbacks);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, []);

    const formatDate = (dt) => {
        const date = new Date(dt);
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return formattedDate;
    }

  return (
    <div className="admin-container">
        <SideMenu/>
        <div className='admin-right'>
            <h2>Feedbacks</h2>
            <table>
                <thead>
                <tr>
                    <th>Feedback</th>
                    <th>Date</th>
                    <th>Employee Name</th>
                </tr>
                </thead>
                <tbody>
                {feedbacks.map((feedback) => (
                    <tr key={feedback.feedbackId}>
                    <td>{feedback.feedback}</td>
                    <td>{formatDate(feedback.date)}</td>
                    <td>{feedback.employeeName}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>  
    </div>
    
  );
};

export default Feedbacks;