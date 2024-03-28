import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as orderActions from "../../store/order";
import * as sessionActions from "../../store/session";
import * as foodActions from "../../store/food";
import './createordermodal.css'

function CreateOrderModal({ isOpen, onClose, food_order, user_id }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [errors, setErrors] = useState([]);
    const [orderName, setOrderName] = useState('');

    console.log('inside modal food_order', food_order)
    let orderId = food_order.food_id
    console.log ('food_order id: ', orderId)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        console.log('inside: ', orderName)
        const orderPayload = {
            order_name: orderName,
            user_id: user_id
        };

        try {

            console.log('Order Payload:', orderPayload);
            const orderResponse = await dispatch(orderActions.createOrderThunk(orderPayload));
            console.log('Order Response:', orderResponse);

            if (orderResponse && orderResponse.order && orderResponse.order.id) {
                const orderId = orderResponse.order.id;
                console.log('Order ID:', orderId);

                const foodPayload = {
                    quantity: food_order.quantity
                };

                const addFoodResponse = await dispatch(orderActions.addFoodToOrderThunk(foodPayload, food_order.id));
                console.log('Add Food Response:', addFoodResponse);

                if (addFoodResponse.success) {
                    onClose();
                } else {
                    setErrors(["Failed to add food to the order"]);
                }
            } else {
                console.error('Invalid order response:', orderResponse);
                setErrors(["Failed to create order"]);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrors([error.message]);
        }
    };

    return (
        isOpen && (
            <div className='create-order-modal-container'>
                <div>
                    <h1>Create Order</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type='text'
                            placeholder='Order Name'
                            value={orderName}
                            onChange={(e) => setOrderName(e.target.value)}
                        />
                        <ul>
                            {errors.map((error, idx) => (
                                <li key={idx}>{error}</li>
                            ))}
                        </ul>
                        {food_order && food_order.food && food_order.food.food_images && food_order.food.food_images.length > 0 &&
                            <img src={food_order.food.food_images[0].url} alt='food' className='food_img'/>
                        }
                        <button type='submit'>Submit</button>
                    </form>
                    <button onClick={onClose}>Back to Cart</button>
                </div>
            </div>
        )
    );
}

//this modal will handle two things:
//if the user wants to add food to an existing order or make a new order starting with that food
//have two separate renders for the two cases, in which I update the state
//if existing order, look thru a list of user orders and add food to that order
//if no order, make a new order and add to that
export default CreateOrderModal
