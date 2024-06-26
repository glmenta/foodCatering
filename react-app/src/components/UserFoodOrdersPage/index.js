import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as orderActions from "../../store/order";
import * as sessionActions from "../../store/session";
import * as foodActions from "../../store/food";
import OrderDetailModal from "../OrderDetailModal";
import CreateOrderModal from "../CreateOrderModal";
import DeleteFoodOrderModal from "../DeleteFoodOrderModal";

const UserFoodOrdersPage = () => {
    const dispatch = useDispatch();

    const user_id = useSelector(state => state.session.user?.id);
    const userFoodOrders = useSelector(state => state.food.currentUserFoodOrders);
    const userOrders = useSelector(state => Object.values(state.order.currentUserOrders));

    const [popupOpen, setPopupOpen] = useState(false);
    const [userOrdersOpen, setUserOrdersOpen] = useState(false);
    const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);
    const [deleteFoodOrderModalOpen, setDeleteFoodOrderModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [selectedFoodOrder, setSelectedFoodOrder] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);
    const [addedFoodOrderIds, setAddedFoodOrderIds] = useState([]);

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

    const openPopup = (food_order) => {
        setSelectedFoodOrder(food_order);
        setPopupOpen(true);
        console.log('inside openPopup', food_order);
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

    const openDeleteFoodOrderModal = (food_order) => {
        setDeleteFoodOrderModalOpen(true);
        setSelectedFoodOrder(food_order);
        setIsLoaded(false);
        closePopup();
    }
    const closeDeleteFoodOrderModal = () => {
        setDeleteFoodOrderModalOpen(false);
        setIsLoaded(true);
    }

    const showUserOrders = () => {
        setUserOrdersOpen(true);
        closePopup();
    };

    const closeUserOrders = () => {
        setUserOrdersOpen(false);
        openPopup();
    };

    const handleAddToOrder = async () => {
        if (!selectedOrderId || !selectedFoodOrder || !selectedFoodOrder.food || !selectedFoodOrder.food.id || !selectedFoodOrder.quantity) return;
        console.log('inside handleAddToOrder', selectedOrderId, selectedFoodOrder);
        const food = {
            food_id: selectedFoodOrder.food.id,
            quantity: selectedFoodOrder.quantity
        };
        console.log('inside handleAddToOrder test: ', food.food_id, selectedOrderId);
        await dispatch(orderActions.addFoodToOrderThunk(selectedOrderId, food.food_id, food.quantity));
        setPopupOpen(false);
        setAddedFoodOrderIds(prevIds => [...prevIds, selectedFoodOrder.id]);
    };

    return (
        <div className='user-food-orders-container'>
            {isLoaded && (
                <div className='user-food-orders'>
                    <h1>Cart</h1>
                    {userFoodOrders?.food_orders && userFoodOrders.food_orders
                        .filter(food_order => !addedFoodOrderIds.includes(food_order.id))
                        .filter(food_order => food_order.order_id === null)
                        .filter(food_order => food_order.quantity > 0)
                        .map(food_order => (
                            <div key={food_order.id}>
                                <h3>{food_order.food.name}</h3>
                                <p>{food_order.quantity}</p>
                                <button onClick={() => openPopup(food_order)}>Add to Order</button>
                                <button onClick={() => openDeleteFoodOrderModal(food_order)}>Remove from Cart</button>
                            </div>
                        ))}
                </div>
            )}

            {popupOpen && (
                <div className='pop-up-prompt'>
                    <p>Do you want to add to an existing order or create a new one?</p>
                    <select onChange={(e) => setSelectedOrderId(e.target.value)}>
                        <option value="">Select an Existing Order</option>
                        {Object.values(userOrders).map(order => (
                            <option key={order?.id} value={order?.id}>
                                {order?.order_name}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => handleAddToOrder(selectedFoodOrder)}>Add to Selected Order</button>
                    <button onClick={openCreateFoodOrderModal}>Add to Order</button>
                </div>
            )}

            {createOrderModalOpen && (
                <div className='create-order-modal'>
                    <CreateOrderModal isOpen={createOrderModalOpen} onClose={closeCreateFoodOrderModal} food_order={selectedFoodOrder} user_id ={user_id}/>
                </div>
            )}

            {deleteFoodOrderModalOpen && (
                <div className='delete-food-order-modal'>
                    <DeleteFoodOrderModal isOpen={deleteFoodOrderModalOpen} onClose={closeDeleteFoodOrderModal} foodOrder={selectedFoodOrder} />
                </div>
            )}

        </div>
    );

}

export default UserFoodOrdersPage
