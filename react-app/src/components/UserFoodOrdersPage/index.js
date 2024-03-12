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
    const userOrders = useSelector(state => Object.values(state.order.currentUserOrders));
    const [popupOpen, setPopupOpen] = useState(false);
    const [userOrdersOpen, setUserOrdersOpen] = useState(false);
    const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(true);

    useEffect(() => {
        dispatch(sessionActions.getAllUsersThunk());
        dispatch(foodActions.getAllFoodsThunk());
        dispatch(orderActions.getUserOrdersThunk(user_id));
    }, [dispatch, user_id]);

    useEffect(() => {
        if (user_id) {
            dispatch(foodActions.getUserFoodOrdersThunk(user_id));
        }
    }, [dispatch, user_id]);

    const openPopup = () => {
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupOpen(false);
    };

    const openCreateFoodOrderModal = () => {
        setCreateOrderModalOpen(true);
        setIsLoaded(false);
        closePopup();
    };

    const closeCreateFoodOrderModal = () => {
        setCreateOrderModalOpen(false);
        setIsLoaded(true);
    };

    const showUserOrders = () => {
        setUserOrdersOpen(true);
        closePopup();
    };

    const closeUserOrders = () => {
        setUserOrdersOpen(false);
        openPopup();
    };

    return (
        <div className='user-food-orders-container'>
        {isLoaded &&
            <div className='user-food-orders'>
                <h1>Cart</h1>
                {userFoodOrders?.food_orders && userFoodOrders.food_orders.map(food_order => (
                    <div key={food_order.id}>
                        <h3>{food_order.food.name}</h3>
                        <p>{food_order.quantity}</p>
                        <button onClick={openPopup}>Add to Order</button>
                    </div>
                ))}
            </div>
            }

        {popupOpen && (
            <div className='pop-up-prompt'>
                <p>Do you want to add to an existing order or create a new one?</p>
                <select onChange={(e) => console.log(e.target.value)}>
                    <option value="">Select an Existing Order</option>
                    {Object.values(userOrders).map(order => (
                        <option key={order.id} value={order.id}>
                            {order.order_name}
                            {/*
                            function here to add food order to order
                            */}
                        </option>
                    ))}
                </select>
                <button onClick={openCreateFoodOrderModal}>Create New Order</button>
            </div>
        )}


        {createOrderModalOpen &&
            <div className='create-order-modal'>
                <CreateOrderModal isOpen={createOrderModalOpen} onClose={closeCreateFoodOrderModal} />
            </div>
        }


        </div>
    );
}

export default UserFoodOrdersPage
