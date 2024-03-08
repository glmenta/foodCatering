import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as orderActions from "../../store/order";
import * as sessionActions from "../../store/session";
import * as foodActions from "../../store/food";
import OrderDetailModal from "../OrderDetailModal";
import CreateFoodOrderModal from "../CreateFoodOrderModal";


const UserFoodOrdersPage = () => {
    const dispatch = useDispatch();
    const user_id = useSelector(state => state.session.user?.id);
    const userFoodOrders = useSelector(state => state.food.currentUserFoodOrders);

    useEffect(() => {
        dispatch(foodActions.getUserFoodOrdersThunk(user_id));
    }, [dispatch, user_id]);

    return (
        <div>
            <h1>My Orders</h1>
            {userFoodOrders && userFoodOrders.food_orders.map(food_order => (
                <div>
                    <h3>{food_order.food.name}</h3>
                    <p>{food_order.quantity}</p>
                </div>
            ))}
        </div>
    )
}

export default UserFoodOrdersPage
