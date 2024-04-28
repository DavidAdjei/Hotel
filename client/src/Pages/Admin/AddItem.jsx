import React, { useState } from 'react';
import { useAdmin } from '../../context/admin';
import SideMenu from '../../component/SideMenu';

function AddItem() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const { addItem } = useAdmin();
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      addItem(name, description, stock, setError)
    } catch (err) {
      console.log(err)
    }
    setName('')
    setDescription("")
    setStock('')
  };

  return (
    <div className='admin-container'>
      <SideMenu />
      <div className="admin-right">
        <h2>Add Item</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock Quantity" />
          <button type="submit">Add Item</button>
        </form>
        {error && 
          <p>{ error }</p>
        }
      </div>
    </div>
  );
}

export default AddItem;