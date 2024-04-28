import React from 'react'
import { useRestaurant } from '../context/restaurant'

export default function Restaurant() {
    const { dishes, cartContent, addToCart, decrement, increment, removeFromCart, handleOrderSubmit, calculateTot } = useRestaurant();


  return (
      <div className='main' style={{flexDirection: 'row'}}>
          {
              dishes.length === 0 ? (
                  <div className='dishes'>
                      <p>No dishes</p>
                  </div>
              ) : (
                <div className='dishes'>
                    <h2>All Dishes</h2>
                    <table>
                        <thead>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </thead>
                        <tbody>
                            {dishes.map(dish => (
                                <tr>
                                    <td>{ dish.name }</td>
                                    <td>{dish.price}</td>
                                    <td><button onClick={() => addToCart(dish)}>Add to Order</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>   
              )
          }
          
          <div className='orders'>
              <h2>
                  Order Details
              </h2>
              <table>
                  <thead>
                      <th>Name</th>
                      <th>Amount</th>
                      <th>Unit Price</th>
                      <th>Total Price</th>
                      <th>Remove</th>
                  </thead>
                  <tbody>
                      {Object.values(cartContent).map((item, index) => (
                          <tr>
                              <td>{ item.name }</td>
                              <td>
                                  <div className='number_of-items'>
                                      <button onClick={() => decrement(item.id, item.numberOfItems)}>-</button>
                                      <p>{item.numberOfItems}</p>
                                      <button onClick={() => increment(item.id)}>+</button>
                                  </div>
                              </td>
                              <td>GH₵{ item.unitPrice }</td>
                              <td> GH₵{item.grandPrice }</td>
                              <td><button onClick={() => removeFromCart(item.id)}>Remove</button></td>
                          </tr>
                      ))}
                  </tbody>
              </table>
            <div className='order_summary'>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center'}}>
                      <p style={{fontSize: '1.3rem'}}>Total Price :</p> 
                      <span style={{fontSize: '1.4rem', fontWeight: 'bold'}}>GH₵ {calculateTot(cartContent)}</span>
                </div>
                <button className='order-submit' onClick={handleOrderSubmit}>Submit</button>
            </div>
          </div>
      
    </div>
  )
}
