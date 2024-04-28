import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom'
import { useEmployee } from '../context/employee';
import { useNavigate } from 'react-router-dom';
axios.defaults.baseURL = 'http://localhost:8000';

const ClientPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [addClientClicked, setAddClientClicked] = useState(false);
  const { fetchClients, clients, addClient, checkIn, checkOut, user } = useEmployee();
  const [error, setError] = useState('');
  const [clickedCheckIn, setClickCheckIn] = useState(false);
  const [clientIdToCheckIn, setClientIdToCheckIn] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("");
  const [numberOfHours, setNumberOfHours] = useState("");
  const [amountCharged, setAmountCharged] = useState("");
  const [durationType, setDurationType] = useState('');
  const [checkOutClicked, setCheckOutClicked] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [checkOutId, setCheckOutId] = useState('');
  const { department } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients(department)
    console.log(clients)
  },[])

  const handleInputChange = (event) => {
    setFeedbackText(event.target.value);
  };

  const handleAddClient = () => {
    setAddClientClicked(!addClientClicked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addClient(name, phone, roomNumber, user.name, numberOfDays, numberOfHours, amountCharged, setError, clearFields, department);
  };

  const handleCheckInClick = (clientId) => {
    setClientIdToCheckIn(clientId);
    setClickCheckIn(true);
  };

  const handleCheckInSubmit = async () => {
    await checkIn(clientIdToCheckIn, roomNumber, user.name, numberOfDays, numberOfHours, amountCharged, setError, clearFields, department);
  };

  const handleDurationSelect = (value) => {
    setDurationType(value); 
    setNumberOfDays('');
    setNumberOfHours('');
  };

  const clearFields = () => {
    setName("");
    setRoomNumber("");
    setNumberOfDays("");
    setNumberOfHours("");
    setAmountCharged("");
    setAddClientClicked(false);
    setClickCheckIn(false);
    setCheckOutClicked(false);
    setFeedbackText("");
    setError("");
    setNumberOfDays("")
    setDurationType('')
    setNumberOfHours('')
    setAmountCharged('')
    setCheckOutId('')
  };


  const handleCheckOutClick = (id) => {
    setCheckOutClicked(true);
    setCheckOutId(id)
  }

  const handleCheckOutSubmit = (e) => {
    e.preventDefault();
    checkOut(checkOutId, feedbackText, user.name, setError ,clearFields, department)
  }

  return (
    <>
      {department === 'hotel' ? (
      <div className='main'>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
          <h2>Clients</h2>
          <button onClick={() => navigate('/all-items')}>View Hotel Items</button>
        </div>
        <button onClick={handleAddClient}>Add Client</button>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Time Of Arrival</th>
              <th>Amount Charged</th>
              <th>Room Number</th>
              <th>Checked In By</th>
              <th>Time Left</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients && clients.map((client) => (
              <tr key={client._id}>
                <td>{client.name}</td>
                <td>{client.phone}</td>
                <td>
                  {client.isCheckedIn ? (
                    <p>{client.history[client.history.length - 1].checkIn.date}, { client.history[client.history.length - 1].checkIn.time }</p>
                  ) : (
                      <p>Not Checked In</p>
                  )}
                </td>
                <td>
                  {client.isCheckedIn ? (
                    `GH₵ ${client.history[client.history.length - 1].amountCharged}`
                  ): ("Not Checked In")}
                </td>
                <td>
                  {client.isCheckedIn ? (
                    <p>{client.history[client.history.length - 1].roomNumber}</p>
                  ) : (
                    <p>Not Checked In</p>
                  )}
                </td>
                <td>
                  {client.isCheckedIn ? (
                    <p>{client.history[client.history.length - 1].checkedInBy.employeeName}</p>
                  ) : (
                    <p>Not Checked In</p>
                  )}
                </td>
                <td>
                  {client.isCheckedIn ? (
                    client.numberOfDays !== null ? (
                      `${client.numberOfDays} days left`
                    ) : client.numberOfHours !== null ? (
                      `${client.numberOfHours} hours left`
                    ) : client.numberOfDays === null ? (
                      `Time's Up Check Out`
                    ): client.numberOfHours === null ? (
                      `Time's Up Check Out`
                    ) : (
                      "Not Checked In"
                    )
                  ) : (
                    "Not Checked In"
                  )}
                </td>
                <td>
                  {client.isCheckedIn ? (
                    <button onClick={() => handleCheckOutClick(client._id)}>Check Out</button>
                  ) : (
                    <button onClick={() => handleCheckInClick(client._id)}>Check In</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {addClientClicked && 
          <div className="add-client-overlay">
            <div className="add-client-form">
              <h2>Add Client</h2>
              <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
                <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="Room Number" />
                <div>
                  <div>
                    <p>Select Duration</p>
                    <select name="durationType" id="durationType" value={durationType} onChange={(e) => handleDurationSelect(e.target.value)}>
                      <option>Select Stay Type</option>
                      <option value="days">Days</option>
                      <option value="hours">Hours</option>
                    </select>
                  </div>
                  {
                    durationType === "days" ? (
                      <input type="number" value={numberOfDays} onChange={(e)=> setNumberOfDays(e.target.value)} placeholder="Enter Number Of Days" />
                    ) : durationType === "hours" && (
                      <input type="number" value={numberOfHours} onChange={(e)=> setNumberOfHours(e.target.value)} placeholder="Enter Number Of Hours" />
                    )
                  }
                </div>
                <input type="number" value={amountCharged} onChange={(e) => setAmountCharged(e.target.value)} placeholder="Amount Charged" />
                {error && 
                  <p>{ error }</p>
                }
                <button type="submit">Add Client</button>
                <button onClick={() => setAddClientClicked(false)} title='Click to deactivate form'>Cancel</button>
              </form>
            </div>
          </div>
        }

        {
          checkOutClicked && (
            <div className='add-client-overlay'>
              <div className='add-client-form'>
                <h2>Check Out Feedback</h2>
                <form onSubmit={handleCheckOutSubmit}>
                  <textarea
                    name="feedback"
                    id="feedback"
                    cols="30"
                    rows="10"
                    value={feedbackText}
                    onChange={handleInputChange}
                  ></textarea>
                  {error && 
                    <p>{ error }</p>
                  }
                  <button type='submit'>Submit</button>
                  <button type='button' onClick={() => setCheckOutClicked(false)}>Cancel</button>
                </form>
              </div>
            </div>
          )
        }

        {clickedCheckIn && 
          <div className="add-client-overlay">
            <div className="add-client-form">
              <h2>Check In</h2>
              <form onSubmit={handleCheckInSubmit}>
                <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="Room Number" />
                <div>
                  <div>
                    <p>Select Duration</p>
                    <select name="durationType" id="durationType" value={durationType} onChange={(e) => handleDurationSelect(e.target.value)}>
                      <option>Select Stay Type</option>
                      <option value="days">Days</option>
                      <option value="hours">Hours</option>
                    </select>
                  </div>
                  {
                    durationType === "days" ? (
                      <input type="number" value={numberOfDays} onChange={(e)=> setNumberOfDays(e.target.value)} placeholder="Enter Number Of Days" />
                    ) : durationType === "hours" && (
                      <input type="number" value={numberOfHours} onChange={(e)=> setNumberOfHours(e.target.value)} placeholder="Enter Number Of Hours" />
                    )
                  }
                </div>
                <input type="number" value={amountCharged} onChange={(e) => setAmountCharged(e.target.value)} placeholder="Amount Charged" />
                {error && 
                  <p>{ error }</p>
                }
                <button type="submit">Check In</button>
                <button onClick={() => setClickCheckIn(false)} title='Click to deactivate form'>Cancel</button>
              </form>
            </div>
          </div>
        }
      </div>
      ) : department === 'swimmingPool' && (
          <div className='main'>
        <h2>Swimming Pool Clients</h2>
        <button onClick={handleAddClient}>Add Client</button>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Time Of Arrival</th>
              <th>Amount Charged</th>
              <th>Overseed By</th>
              <th>Time Left</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients && clients.map((client) => (
              <tr key={client._id}>
                <td>{client.name}</td>
                <td>{client.phone}</td>
                <td>
                  {client.isSwimming ? (
                    <p>{client.history[client.history.length - 1].swimStart.time }</p>
                  ) : (
                      <p>Not Swimming</p>
                  )}
                </td>
                <td>
                  {client.isSwimming ? (
                    `GH₵ ${client.history[client.history.length - 1].amountCharged}`
                  ): ("Not Swimming")}
                </td>
                <td>
                  {client.isSwimming ? (
                    <p>{client.history[client.history.length - 1].overseedBy.employeeName}</p>
                  ) : (
                    <p>Not Swimming</p>
                  )}
                </td>
                <td>
                  {client.isSwimming ? (
                    client.numberOfHours !== null ? (
                      `${client.numberOfHours} hours left`
                    ) : client.numberOfHours === null ? (
                      `Time's Up Check Out`
                    ) : (
                      "Not Swimming"
                    )
                  ) : (
                    "Not Swimming"
                  )}
                </td>
                <td>
                  {client.isSwimming ? (
                    <button onClick={() => handleCheckOutClick(client._id)}>Check Out</button>
                  ) : (
                    <button onClick={() => handleCheckInClick(client._id)}>Check In</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {addClientClicked && 
          <div className="add-client-overlay">
            <div className="add-client-form">
              <h2>Add Client</h2>
              <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
                <input type="number" value={numberOfHours} onChange={(e)=> setNumberOfHours(e.target.value)} placeholder="Enter Number Of Hours" />
                <input type="number" value={amountCharged} onChange={(e) => setAmountCharged(e.target.value)} placeholder="Amount Charged" />
                {error && 
                  <p>{ error }</p>
                }
                <button type="submit">Add Client</button>
                <button onClick={() => setAddClientClicked(false)} title='Click to deactivate form'>Cancel</button>
              </form>
            </div>
          </div>
        }

        {
          checkOutClicked && (
            <div className='add-client-overlay'>
              <div className='add-client-form'>
                <h2>Check Out Feedback</h2>
                <form onSubmit={handleCheckOutSubmit}>
                  <textarea
                    name="feedback"
                    id="feedback"
                    cols="30"
                    rows="10"
                    value={feedbackText}
                    onChange={handleInputChange}
                  ></textarea>
                  {error && 
                    <p>{ error }</p>
                  }
                  <button type='submit'>Submit</button>
                  <button type='button' onClick={() => setCheckOutClicked(false)}>Cancel</button>
                </form>
              </div>
            </div>
          )
        }

        {clickedCheckIn && 
          <div className="add-client-overlay">
            <div className="add-client-form">
              <h2>Check In</h2>
              <form onSubmit={handleCheckInSubmit}>
                <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="Room Number" />
                <input type="number" value={numberOfHours} onChange={(e)=> setNumberOfHours(e.target.value)} placeholder="Enter Number Of Hours" />
                <input type="number" value={amountCharged} onChange={(e) => setAmountCharged(e.target.value)} placeholder="Amount Charged" />
                {error && 
                  <p>{ error }</p>
                }
                <button type="submit">Check In</button>
                <button onClick={() => setClickCheckIn(false)} title='Click to deactivate form'>Cancel</button>
              </form>
            </div>
          </div>
        }
      </div>
      )}
    </>
  );
};

export default ClientPage;
