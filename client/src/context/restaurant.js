import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';

const RestaurantContext = createContext();

export const useRestaurant = () => {
    return useContext(RestaurantContext)
}

export const RestaurantProvider = ({children}) => {
    const [dishes, setDishes] = useState([]);
    const [cartContent, setCartContent] = useState({});
    const [orders, setOrders] = useState([]);

    const fetchDishes = () => {
        axios.get('/dishes').then(response => {
            if (!response.data.error) {
                setDishes(response.data.dishes);
            } else {
                console.log(response.data.error)
            }
        })
    }

    const fetchOrders = () => {
        axios.get('/viewOrders').then(response => {
            if (!response.data.error) {
                setOrders(response.data.orders);
            } else {
                console.log(response.data.error)
            }
        })
    }

    

    useEffect(() => {
        fetchDishes()
        fetchOrders()
    }, [])
    

    const addDish = (name, price, category, description, setError ) => {
        axios.post('/addDish', { name, price, category, description })
            .then(response => {
                if (!response.data.error) {
                    console.log("Sign up successful");
                    fetchDishes();
                    alert('Sign Up successful');  
                } else {
                    setError(response.data.error)
                    alert(response.data.error)
                }
            }).catch(err => {
                console.log(err)
            })
    }

    const addToCart = (item) => {
        setCartContent(prevCartContent => {
            const newItem = {
                id: item._id,
                name: item.name,
                unitPrice: item.price,
                numberOfItems: 1,
                grandPrice: item.price, 
            };
            return { ...prevCartContent, [item._id]: newItem };
        });
    }

    const removeFromCart = (itemId) => {
        setCartContent(prevCartContent => {
            const updatedCartContent = { ...prevCartContent };
            delete updatedCartContent[itemId];
            return updatedCartContent;
        });
    }

     const decrement = (itemId, number) => {
        if(number > 1){
            const updatedItem = { ...cartContent[itemId], numberOfItems: cartContent[itemId].numberOfItems - 1, grandPrice: cartContent[itemId].unitPrice * number };
            const updatedContent = { ...updatedItem, grandPrice: updatedItem.unitPrice * updatedItem.numberOfItems };
                setCartContent({...cartContent, [itemId]: updatedContent})
            } else {
                removeFromCart(itemId); 
            }
    };

    const increment = (itemId) => {
        const updatedItem = { ...cartContent[itemId], numberOfItems: cartContent[itemId].numberOfItems + 1};
        const updatedContent = { ...updatedItem, grandPrice: updatedItem.unitPrice * updatedItem.numberOfItems };
            setCartContent({...cartContent, [itemId]: updatedContent})
    }

    const handleOrderSubmit = () => {
        const items = Object.values(cartContent).map(item => ({
            dish: item.id,
            quantity: item.numberOfItems,
            price: item.grandPrice
        }));
        axios.post('/placeOrder', {
            items,
            totalPrice: calculateTot(cartContent),
        }).then(response => {
            console.log('Order placed successfully: ', response.data.order);
            setCartContent({});
            fetchOrders();
        }).catch(err => {
            console.log('Error placing order: ' + err)
        })
    }

    const calculateTot = (cartContent) => {
        let tot = 0;
        Object.values(cartContent).forEach(item => {
            tot += item.grandPrice;
        });

        return tot;
    }

    return (
        <RestaurantContext.Provider value={{dishes, addDish, cartContent, addToCart, removeFromCart, decrement, increment, handleOrderSubmit, orders, calculateTot}}>
            {children}
        </RestaurantContext.Provider>
    )
}