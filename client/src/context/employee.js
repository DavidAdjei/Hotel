import React, { useContext, createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = "http://localhost:8000";

const EmployeeContext = createContext();

export const useEmployee = () => {
    return useContext(EmployeeContext);
}

export const EmployeeProvider = ({ children }) => {
    const navigate = useNavigate();
    // const { department } = useParams();

    // State variables
    const [loggedIn, setIsLoggedIn] = useState(!!localStorage.token);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [clients, setClients] = useState([]);

    const updateDaysRemaining = () => {
        axios.post('/updateDaysRemaining').then(response => {
            if (!response.data.error) {
                console.log("Number Of Days Updated")
                fetchClients("hotel");
            } else {
                console.log(response.data.error)
            }
        }).catch(err => {
                console.log(err)
        })
    }

    const updateHoursRemaining = () => {
        axios.post('/updateHoursRemaining/hotel').then(response => {
            if (!response.data.error) {
                console.log("Number Of Hours Updated")
                fetchClients('hotel');
            } else {
                console.log(response.data.error)
            }
        }).catch(err => {
                console.log(err)
        })
    }

    const updateSwimmingHours = () => {
        axios.post('/updateHoursRemaining/swimmingPool').then(response => {
            if (!response.data.error) {
                console.log("Number Of Hours Updated")
                fetchClients('swimmingPool');
            } else {
                console.log(response.data.error)
            }
        }).catch(err => {
                console.log(err)
        })
    }


    // Fetch clients on component mount
    useEffect(() => {
        updateDaysRemaining();
        updateHoursRemaining();
        updateSwimmingHours();

        // Fetch clients periodically (every 1 hour)
        const interval = setInterval(() => {
            updateDaysRemaining();
            updateHoursRemaining();
            updateSwimmingHours();
            fetchClients();
        }, 60 * 60 * 1000); 

        return () => clearInterval(interval); 
    }, []);
    
    const fetchClients = (department) => {
        axios.get(`/allClients/${department}`)
            .then(response => {
                if (!response.data.error) {
                    setClients(response.data.organisation.clients);
                } else {
                    console.log(response.data.error);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    // Login function
    const login = (email, password, setError) => {
        axios.post(`/signin`, { email, password, setError })
            .then(response => {
                if (!response.data.error) {
                    console.log("Login successful");
                    alert('Login successful');
                    localStorage.setItem('user', JSON.stringify(response.data.employee));
                    localStorage.setItem('token', response.data.token);
                    setIsLoggedIn(true);
                    console.log(JSON.parse(localStorage.getItem('user')))
                    setUser(response.data.employee);
                    navigate('/home');
                } else {
                    setError(response.data.error)
                    console.log(response.data.error);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    // Add client function
    const addClient = (name, phone, roomNumber, checkedInBy, numberOfDays, numberOfHours, amountCharged, setError, clearFields, department) => {
        axios.post(`/addClient/${department}`, { name, phone, roomNumber, checkedInBy, numberOfDays ,numberOfHours, amountCharged })
            .then(response => {
                if (!response.data.error) {
                    console.log("Client added successfully");
                    alert('Client added successfully');
                    clearFields();
                    fetchClients(department);
                    navigate(`/clients/${department}`)
                } else {
                    setError(response.data.error);
                    console.log(response.data.error);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    // Check-in function
    const checkIn = (clientId, roomNumber, checkedInBy, numberOfDays, numberOfHours, amountCharged, setError, clearFields, department) => {
        axios.post(`/checkIn/${department}`, { clientId, roomNumber, checkedInBy, numberOfDays, numberOfHours, amountCharged })
            .then(response => {
                if (!response.data.error) {
                    console.log("Checked in successfully");
                    fetchClients(department);
                    clearFields();
                    navigate(`/clients/${department}`)
                } else {
                    setError(response.data.error)
                    console.log(response.data.error);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    // Check-out function
    const checkOut = (clientId, feedback, employeeName,setError, clearFields, department) => {
        axios.post(`/checkOut/${department}`, { clientId, feedback, employeeName })
            .then(response => {
                if (!response.data.error) {
                    console.log("Checked out successfully");
                    fetchClients(department);
                    clearFields();
                    navigate(`/clients/${department}`)
                } else {
                    setError(response.data.error)
                    console.log(response.data.error);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    // Logout function
    const logout = () => {
        axios.post(`/logout/${user._id}`)
            .then(response => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");  
                setIsLoggedIn(false);
                setUser(null);
                setClients([])
            }
        )
    };

    return (
        <EmployeeContext.Provider value={{ user, login, logout, addClient, checkIn, clients, checkOut, loggedIn, fetchClients }} >
            {children}
        </EmployeeContext.Provider>
    )
}
