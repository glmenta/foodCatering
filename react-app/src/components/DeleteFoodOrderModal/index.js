import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import * as foodActions from "../../store/food";
function DeleteFoodOrderModal({ isOpen, onClose, foodOrder }) {
    const dispatch = useDispatch();
    const history = useHistory();
    console.log('inside modal', foodOrder, foodOrder.id)
    // const userFoodOrders = useSelector(state => sessionActions.getUserFoodOrders(user.id));
    useEffect(() => {
        dispatch(sessionActions.getUserFoodOrdersThunk(foodOrder.user_id));

    }, [dispatch, foodOrder.user_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(foodActions.deleteFoodOrderThunk(foodOrder.id));
    }

    return (
        isOpen &&
        <div>
            <div>
                <h1>Are you sure you want to delete this order?</h1>
                <button onClick={handleSubmit}>Delete</button>
                <button onClick={onClose}>Back to Cart</button>
            </div>
        </div>
    )
}

export default DeleteFoodOrderModal
