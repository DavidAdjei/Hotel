import React from 'react';
import SideMenu from '../../component/SideMenu';
import { useRestaurant } from '../../context/restaurant';

function Orders() {
    const { orders, dishes } = useRestaurant();

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
        <div className='admin-container'>
            <SideMenu />
            <div className="admin-right">
                <h2>Orders</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Order Items</th>
                            <th>Number Purchased</th>
                            <th>Individual Prices</th>
                            <th>Total Price</th>
                            <th>Order Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>
                                    {order.items.map((item, index) => (
                                        <div key={index}>
                                            {dishes.find(dish => dish._id.toString() === item.dish)?.name}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {order.items.map((item, index) => (
                                        <div key={index}>
                                            {item.quantity}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {order.items.map((item, index) => (
                                        <div key={index}>
                                            {item.price}
                                        </div>
                                    ))}
                                </td>
                                <td>{order.totalAmount}</td>
                                <td>{formatDate(order.orderDate)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Orders;
