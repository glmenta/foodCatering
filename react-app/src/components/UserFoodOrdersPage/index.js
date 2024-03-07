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
    const userFoodOrders = useSelector(state => state.order.currentUserFoodOrders);

    useEffect(() => {
        dispatch(foodActions.getUserFoodOrdersThunk(user_id));
    }, [dispatch, user_id]);

    return (
        <div>
            <h1>My Orders</h1>
            <ul>
                {userFoodOrders?.map(order => (
                    <li key={order.id}>
                        <OrderDetailModal order={order} />
                        <CreateFoodOrderModal user_id={user_id} menu_id={order.menu_id} food={order.food} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UserFoodOrdersPage
