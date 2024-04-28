import React, { useState } from 'react';
import SideMenu from '../../component/SideMenu';
import { useRestaurant } from '../../context/restaurant';

function AddDish() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const { addDish } = useRestaurant();
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      addDish(name, price, category, description, setError)
    } catch (err) {
      console.log(err)
    }
    setName('')
    setPrice("")
    setCategory('')
    setDescription("")
    setError("")
  };

  return (
    <div className='admin-container'>
      <SideMenu />
      <div className="admin-right">
        <h2>Add Dish</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          {error && 
                <p>{ error }</p>
            }
          <button type="submit">Add Dish</button>
        </form>
      </div>
    </div>
  );
}

export default AddDish;