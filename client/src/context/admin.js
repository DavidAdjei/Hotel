import React, { useContext, createContext, useState, useEffect } from 'react'
import axios from 'axios'
axios.defaults.baseURL = "http://localhost:8000"

const AdminContext = createContext();

export const useAdmin = () => {
    return useContext(AdminContext)
}

export const AdminProvider = ({ children }) => {
    const [employees, setEmployees] = useState([]);
    const [items, setItems] = useState([]);



    const getItems = () => {
        axios.get('/items').then(response => {
            if (!response.data.error) {
                setItems(response.data.items);
            } else {
                console.log(response.data.error)
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const getEmployees = () => {
    axios.get('/allEmployees').then(response => {
        if (!response.data.error) {
            setEmployees(response.data.employees);
        } else {
            console.log(response.data.error);
        }
    }).catch(err => {
        console.log(err);
    });
    };


    useEffect(() => {
        getEmployees()
        getItems()
    }, []
    )

    const addEmployee = (name, email, password, phone, salary, setError) => {
        axios.post(`/signUp`, {
                name,
                email,
                password,
                phone,
                salary
            }).then(response => {
               if (!response.data.error) {
                   console.log("Sign up successful");
                   getEmployees();
                   alert('Sign Up successful');
               } else {
                   setError(response.data.error)
                    console.log(response.data.error)
                } 
            }).catch(err => {
                console.log(err);
            }
        )
    }

    const makeAdmin = (id, setError) => {
        axios.put(`/makeAdmin/${id}`).then(response => {
            if (!response.data.error) {
                console.log("Made Admin");
                getEmployees();
                alert('Successful');
            } else {
                setError(response.data.error)
                console.log(response.data.error)
            } 
        }).catch((err) => {
            console.log(err)
        })
    }

    const removeAdmin = (id, setError) => {
        axios.put(`/removeAdmin/${id}`).then(response => {
            if (!response.data.error) {
                console.log("Removed Admin");
                getEmployees();
                alert('Successful');
            } else {
                setError(response.data.error)
                console.log(response.data.error)
            } 
        }).catch((err) => {
            console.log(err)
        })
    }

    const addItem = (name, description, stock, setError) => {
        axios.post(`/addItems`, {
                name,
                description,
                stock,
            }).then(response => {
               if (!response.data.error) {
                   console.log("Added successful");
                   getItems();
                alert('Added successful');
               } else {
                   setError(response.data.error)
                    console.log(response.data.error)
                } 
            }).catch(err => {
                console.log(err);
            }
        )
    }

    const editItem = (itemId, name, description, stock, editedBy, setError) => {
        axios.put(`/editItem/${itemId}`, {
            name, description, stock, editedBy
        }).then(response => {
            if (!response.data.error) {
                console.log("Edited successful");
                getItems();
                alert('Edited successful');
            } else {
                setError(response.data.error)
                console.log(response.data.error)
            }
        }).catch(err => {
            console.log(err);
        }
        )
    }

    const deleteItem = (itemId, setError) => {
        axios.delete(`/deleteItem/${itemId}`).then(response => {
            if (!response.data.error) {
                console.log("Deleted successful");
                getItems();
                alert('Deleted successful');
            } else {
                setError(response.data.error)
                console.log(response.data.error)
            }
        }).catch(err => {
            console.log(err);
        }
        )
    }

    return (
        <AdminContext.Provider value={{employees, items, addEmployee, addItem, editItem, deleteItem, makeAdmin, removeAdmin}}>
            {children}
        </AdminContext.Provider> 
    )
}