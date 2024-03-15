import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as orderActions from "../../store/order";
// import './orderdetail.css'

function OrderDetailModal({ isOpen, onClose, orderId, orderMessages }) {
    const dispatch = useDispatch();
    const user_orders = useSelector(state => Object.values(state.order.currentUserOrders))
    const [quantityUpdates, setQuantityUpdates] = useState({})
    const [selectedFoodOrder, setSelectedFoodOrder] = useState(null)
    const [showConfirmation, setShowConfirmation] = useState(false)

    const order = user_orders.find(order => order.id === orderId)

    useEffect(() => {
        dispatch(orderActions.getOrderThunk(orderId))
    }, [dispatch, orderId])

    console.log('Order: ', order)

    const updateQuantity = (foodOrderId, delta, initialQuantity) => {
        const updatedQuantity = (quantityUpdates[foodOrderId] || initialQuantity || 0) + delta;
        const newQuantity = Math.max(updatedQuantity, 0);
        setQuantityUpdates({ ...quantityUpdates, [foodOrderId]: newQuantity });

        if (newQuantity === 0 && foodOrderId) {
            dispatch(orderActions.removeFoodFromOrderThunk(orderId, foodOrderId));
            setShowConfirmation(true);
        }
    };

    const removeFoodOrder = () => {
        dispatch(orderActions.removeFoodFromOrderThunk(orderId, selectedFoodOrder));
        setShowConfirmation(false);
        setSelectedFoodOrder(null);
    };
    const saveQuantityUpdates = () => {
        dispatch(orderActions.updateFoodOrderQuantitiesThunk(orderId, quantityUpdates));
        setQuantityUpdates({});
    };

    const totalPrice = order ? order.foodOrders.reduce((acc, foodOrder) => {
        const updatedQuantity = quantityUpdates[foodOrder.id] || foodOrder.quantity;
        return acc + (updatedQuantity * foodOrder.food.price);
    }, 0) : 0;

    return (
        isOpen &&
        <div className='order-detail-modal'>
            <div className='order-detail-modal-header'>
                <h2>{order?.order_name}</h2>
                {order?.foodOrders.map(foodOrder => (
                    <div className='food-order-detail' key={foodOrder.id}>
                        <div>Food Name: {foodOrder?.food.name}</div>
                        <div>Price: ${foodOrder?.food.price}</div>
                        <div>{quantityUpdates[foodOrder.id] || foodOrder.quantity}</div>
                        <div>
                            <button onClick={() => updateQuantity(foodOrder.id, -1, foodOrder.quantity)}>-</button>
                            <button onClick={() => updateQuantity(foodOrder.id, 1, foodOrder.quantity)}>+</button>
                            <button onClick={saveQuantityUpdates}>Save</button>
                        </div>
                    </div>
                ))}
                {showConfirmation && (
                    <div className="confirmation-modal">
                        <p>Are you sure you would like to remove this food order?</p>
                        <button onClick={removeFoodOrder}>Yes</button>
                        <button onClick={() => setShowConfirmation(false)}>No</button>
                    </div>
                )}
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
