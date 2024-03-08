import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as foodActions from "../../store/food";

// if no orders, make a new order; if there is order, add food to order
function CreateFoodOrderModal({ user_id, menu_id, food, isOpen, onClose }) {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const userOrders = useSelector(state => state.order.currentUserOrders);
    console.log('inside modal', menu_id, food)
    console.log('userOrders: ', userOrders)
    console.log('user_id: ', user_id)

    useEffect(() => {
        dispatch(foodActions.getUserFoodOrdersThunk(user_id));
    }, [dispatch, user_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const food_order = {
                menu_id,
                food: food.id,
                quantity
            };

            const response = await dispatch(foodActions.createFoodOrderThunk(food_order, user_id));

            if (!response.ok && response.status === 400) {
                const responseData = await response.json();
                setErrors([responseData.message || 'An error occurred while creating the food order.']);
            } else {
                setQuantity(1);
                onClose();
            }
        } catch (error) {
            console.error('Error creating food order:', error);
            setErrors(['An error occurred while creating the food order. Please try again.']);
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

            </form>
            <button type="submit" onClick={handleSubmit}>Add to Cart</button>
        </div>
    );
}

export default CreateFoodOrderModal;
