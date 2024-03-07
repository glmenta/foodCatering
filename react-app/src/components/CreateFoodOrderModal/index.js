import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as foodActions from "../../store/food";
import * as sessionActions from "../../store/session";
import * as orderActions from "../../store/order";

// if no orders, make a new order; if there is order, add food to order
function CreateFoodOrderModal({ user_id, menu_id, food, isOpen, onClose }) {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const userOrders = useSelector(state => state.order.currentUserOrders);
    const userFoodOrders = useSelector(state => state.order.currentUserFoodOrders);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    console.log('inside modal', menu_id, food)
    console.log('userOrders: ', userOrders)
    console.log('user_id: ', user_id)
    useEffect(() => {
        dispatch(foodActions.getUserFoodOrdersThunk(user_id));
    }, [dispatch, user_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = [];

        const food_order = {
            menu_id,
            food_id: food.id,
            quantity
        }
            if (newErrors.length > 0) {
                setErrors(newErrors);
                return;
            }

            const data = await dispatch(foodActions.createFoodOrderThunk(food_order, user_id));

            if (data.newErrors) {
                setErrors(data.newErrors);
            } else {
                setQuantity(1);
                onClose();
            }
    };

    return (
        isOpen &&
        <div className='create-food-order-modal'>
            <h1>Create Food Order</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <h2>{food.name}</h2>
                <h3>${food.price}</h3>
                <label>
                    Quantity
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </label>
                <button type="submit">Add to Cart</button>
            </form>
        </div>
    );
}

export default CreateFoodOrderModal;
