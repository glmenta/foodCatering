import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as orderActions from "../../store/order";
import * as sessionActions from "../../store/session";
import * as foodActions from "../../store/food";
import OrderDetailModal from "../OrderDetailModal";
import CreateOrderModal from "../CreateOrderModal";


const UserFoodOrdersPage = () => {
    const dispatch = useDispatch();
    const user_id = useSelector(state => state.session.user?.id);
    const userFoodOrders = useSelector(state => state.food.currentUserFoodOrders);

    useEffect(() => {
        dispatch(foodActions.getUserFoodOrdersThunk(user_id));
    }, [dispatch, user_id]);

    return (
        <div>
            <h1>Cart</h1>
            {userFoodOrders && userFoodOrders.food_orders.map(food_order => (
                <div>
                    <h3>{food_order.food.name}</h3>
                    <p>{food_order.quantity}</p>
                    <button>Add to Order</button>
                </div>
            ))}
            <div>
                Popup: Do you want to add to existing order? or create new order
            </div>
        </div>

    )
}

export default UserFoodOrdersPage
