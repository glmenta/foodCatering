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
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const noExistingOrders = userOrders.length === 0;
    console.log('inside modal', menu_id, food)
    console.log('userOrders: ', userOrders)

    useEffect(() => {
        dispatch(orderActions.getUserOrdersThunk(user_id));
    }, [dispatch, user_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = [];

        const payload = {
            menu_id,
            food_id: food.id,
            quantity
        }

        const selectedOrder = userOrders[selectedOrderId];
        if (!selectedOrder) {
            newErrors.push("Please select an order.");
        }

        if (quantity <= 0) {
            newErrors.push("Quantity must be greater than 0.");
        }

        if (selectedOrder && selectedOrder.foodOrders.some(foodOrder => foodOrder.food_id === food.id)) {
            newErrors.push("This food item already exists in this order.");
        } else {
            if (noExistingOrders) {
                const newOrderPayload = {
                    user_id,
                    order_name: "New Order"
                };
                await dispatch(orderActions.createOrderThunk(newOrderPayload));
            }

            const data = await dispatch(foodActions.createFoodOrder(payload));

            if (data.newErrors) {
                setErrors(data.newErrors);
            } else {
                setQuantity(1);
                onClose();
            }
        }
    };


    const handleOrderSelect = (e) => {
        const orderId = parseInt(e.target.value);
        setSelectedOrderId(orderId);
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
                    {noExistingOrders && (
                        <li>No existing orders found. A new order will be created.</li>
                    )}
                </ul>
                <h2>{food.name}</h2>
                <label>
                    Quantity
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </label>
                {noExistingOrders && (
                    <p>No existing orders found. A new order will be created.</p>
                )}
                <label>
                    Select Existing Order:
                    <select onChange={handleOrderSelect}>
                        <option value="">Select an Order</option>
                        {Object.values(userOrders).map(order => (
                            <option key={order.id} value={order.id}>
                                {order.order_name} - {order.createdAt}
                            </option>
                        ))}
                    </select>

                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreateFoodOrderModal;
