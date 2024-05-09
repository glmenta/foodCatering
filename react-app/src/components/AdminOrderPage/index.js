import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import * as messageActions from "../../store/message";
import * as orderActions from "../../store/order";

function AdminOrderPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const orders = useSelector(state => state.allOrders.orders);
    const loading = useSelector(state => state.order.loading);
    const error = useSelector(state => state.order.error);
    console.log('orders: ', orders)
    useEffect(() => {
        dispatch(sessionActions.getAllUsersThunk());
        dispatch(messageActions.getMessages());
        dispatch(orderActions.getAllOrdersThunk());
    }, [dispatch]);

    const handleEdit = (orderId) => {
        history.push(`/orders/edit/${orderId}`);
    };

    const handleDelete = (orderId) => {
        dispatch(orderActions.deleteOrderThunk(orderId));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='admin-order-page'>
            <h1>Admin Order Page</h1>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User ID</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.userId}</td>
                            <td>{order.status}</td>
                            <td>
                                <button onClick={() => handleEdit(order.id)}>Edit</button>
                                <button onClick={() => handleDelete(order.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminOrderPage;
