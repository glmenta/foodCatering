import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as foodActions from "../../store/food";
import * as sessionActions from "../../store/session";

function CreateFoodOrderModal({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [errors, setErrors] = useState([]);

    console.log('inside modal')
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await dispatch(foodActions.createFoodOrder());
        if (data) {
            setErrors(data);
        } else {
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
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreateFoodOrderModal;
