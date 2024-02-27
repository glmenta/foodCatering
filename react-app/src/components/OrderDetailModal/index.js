import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as orderActions from "../../store/order";
// import './orderdetail.css'

function OrderDetailModal({ isOpen, onClose, orderId, orderMessages }) {
    const dispatch = useDispatch();
    const user_orders = useSelector(state => Object.values(state.order.currentUserOrders))

    const order = user_orders.find(order => order.id === orderId)

    useEffect(() => {
        dispatch(orderActions.getOrderThunk(orderId))
    }, [dispatch, orderId])

    console.log('Order: ', order)

    const totalPrice = order ? order.foodOrders.reduce((acc, foodOrder) => acc + (foodOrder.quantity * foodOrder.food.price), 0) : 0;
    console.log('orderMessages: ', orderMessages)
    return (
        isOpen &&
        <div className='order-detail-modal'>
            <div className='order-detail-modal-header'>
                <h2>{order?.order_name}</h2>
                {order?.foodOrders.map(foodOrder => (
                    <div className='food-order-detail' key={foodOrder.id}>
                        <div>Food Name: {foodOrder.food.name}</div>
                        <div>Price: ${foodOrder.food.price}</div>
                        <div>Quantity: {foodOrder.quantity}</div>
                    </div>
                ))}
                <div className='order-messages'>
                    <h3>Order Messages</h3>
                    {Array.isArray(orderMessages?.messages) && orderMessages.messages.map(message => (
                        <div key={message.id}>{message.content}</div>
                    ))}
                </div>
                <div>Total Price: ${totalPrice.toFixed(2)}</div>
                <button onClick={onClose}>X</button>
            </div>
        </div>
    );

}

export default OrderDetailModal