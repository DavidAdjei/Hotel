import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideMenu from '../../component/SideMenu';
import { useAdmin } from '../../context/admin';
import { useParams } from 'react-router-dom';

const EditHistoryList = () => {
    const { items } = useAdmin();
    const { id } = useParams();
    const [item, setItem] = useState(null);

    useEffect(() => {
        const findItem = items.find(item => item._id.toString() === id);
        setItem(findItem);
    }, [items, id]);
    
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

    if (!item) {
        return <div>Loading...</div>; // or render a loading indicator
    }

    return (
        <div className='admin-container'>
            <SideMenu/>
            <div className='admin-right'>
                <h2>Edit History for {item.name}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Edited By</th>
                            <th>Edited At</th>
                            <th>Fields Changed</th>
                            <th>Quantity Available</th>
                            <th>Quantity Remaining</th>
                        </tr>
                    </thead>
                    <tbody>
                        {item.editHistory.map((history) => (
                            <tr key={history._id}>
                                <td>{history.editedBy.employeeName}</td>
                                <td>{formatDate(history.editedAt)}</td>
                                <td style={{listStyle: 'none', textTransform: 'capitalize'}}>
                                    {history.editedFields.map((field) => (
                                        <li key={field._id}>{field.field}</li>
                                    ))}
                                </td>
                                <td style={{listStyle: 'none', textTransform: 'capitalize'}}>
                                    {history.editedFields.map((field) => (
                                        <li key={field._id}>{field.valueBefore}</li>
                                    ))}
                                </td>
                                <td style={{listStyle: 'none', textTransform: 'capitalize'}}>
                                    {history.editedFields.map((field) => (
                                        <li key={field._id}>{field.valueAfter}</li>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EditHistoryList;
