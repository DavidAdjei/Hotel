import React, { useState } from 'react';
import { useAdmin } from '../../context/admin';
import SideMenu from '../../component/SideMenu';
import { useEmployee } from '../../context/employee';
import { useNavigate } from 'react-router-dom';

function Items() {
  const { items, editItem, deleteItem } = useAdmin();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [editClicked, setEditClicked] = useState(null);
  const [deleteClicked, setDeleteClicked] = useState(false);
  const { user } = useEmployee();
  const navigate = useNavigate();


  const handleSubmit = (id) => {
    let editedBy = user.name.toString();
    editItem(id, name, description, stock, editedBy);
    console.log(editedBy)
    setEditClicked(null);
  };

  const handleEditClick = (item) => {
    setEditClicked(item._id);
    setName(item.name);
    setDescription(item.description);
    setStock(item.stockQuantity);
  };

  const checkEditHistory = (id) => {
    navigate(`/admin/editHistory/${id}`)
  }

  return (
    <div className='admin-container'>
      {
        user.isAdmin && <SideMenu />
      }
      <div className={user.isAdmin ? 'admin-right' : 'all-items'}>
        <h2>All Items</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Stock</th>
              <th>Edit</th>
              {
                user.isAdmin && <th>Delete</th>
              }
              {
                user.isAdmin && <th>View Edit History</th>
              }
              
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id}>
                {editClicked === item._id ? (
                  <>
                    <td><input type="text" value={name} readOnly onChange={(e) => setName(e.target.value)} /></td>
                    <td><input type="text" value={description} readOnly onChange={(e) => setDescription(e.target.value)} /></td>
                    <td><input type="number" value={stock} onChange={(e) => setStock(e.target.value)} /></td>  
                    <td><button onClick={() => handleSubmit(item._id)}>Save</button></td>
                    {
                      user.isAdmin &&
                        <td><button onClick={() => deleteItem(item._id)}>Delete</button></td>
                    }
                    {
                      user.isAdmin &&
                        <td><button onClick={() => checkEditHistory(item._id)}>Check Edit History</button></td>
                    }
                  </>
                ) : (
                  <>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.stockQuantity}</td>
                    <td><button onClick={() => handleEditClick(item)}>Edit</button></td>
                    {
                      user.isAdmin &&
                        <td><button onClick={() => deleteItem(item._id)}>Delete</button></td>
                    }
                    {
                      user.isAdmin &&
                        <td><button onClick={() => checkEditHistory(item._id)}>Check Edit History</button></td>
                    }
                    
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Items;
