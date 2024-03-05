import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as foodActions from "../../store/food";
import * as sessionActions from "../../store/session";
import * as orderActions from "../../store/order";

// if no orders, make a new order; if there is order, add food to order
function CreateFoodOrderModal({ user_id, menu_id, food, isOpen, onClose }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [errors, setErrors] = useState([]);
    const [quantity, setQuantity] = useState(1);

    console.log('inside modal', menu_id, food)

    useEffect(() => {
        dispatch(orderActions.getUserOrdersThunk(user_id));
    }, [dispatch, user_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = {};

        const payload = {
            menu_id,
            food_id: food.id,
            quantity
        }

        const data = await dispatch(foodActions.createFoodOrder(payload));

        if (data) {
            setErrors(data);
        } else {
            setErrors([]);
            setQuantity(1);
            onClose();
        }

    };

    // menu_id, food_id, quantity
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
                <h2></h2>
                <label>
                    Quantity
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreateFoodOrderModal;
