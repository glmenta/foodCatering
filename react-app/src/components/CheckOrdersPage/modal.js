import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as orderActions from '../../store/order';

function CheckOrderModal({ isOpen, onClose, orderId }) {
    const dispatch = useDispatch();
    const orderDetails = useSelector(state => state.order.allOrders.orders.find(order => order.id === orderId));

    useEffect(() => {
        if (orderId) {
            dispatch(orderActions.getOrderThunk(orderId));
        }
    }, [dispatch, orderId]);

    if (!isOpen) return null;

    return (
        <div className="modal-background" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Order Details</h2>
                {orderDetails ? (
                    <div>
                        <p>Order Name: {orderDetails.order_name}</p>
                        <p>Order ID: {orderDetails.id}</p>
                        <p>Created At: {orderDetails.createdAt}</p>
                        <p>Updated At: {orderDetails.updatedAt}</p>
                        <ul>
                            {orderDetails.foodOrders.map((food, index) => (
                                <li key={index}>
                                    {food.name} - Quantity: {food.quantity}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default CheckOrderModal;
