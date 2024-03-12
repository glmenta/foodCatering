import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as orderActions from "../../store/order";
import * as sessionActions from "../../store/session";
import * as foodActions from "../../store/food";
// import './createordermodal.css'

function CreateOrderModal({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
    }

    return (
        isOpen &&
        <div className='create-order-modal-container'>
            <div>
                <h1>Create Order</h1>
                <button onClick={onClose}>Back to Cart</button>
            </div>
        </div>
    )
}

//this modal will handle two things:
//if the user wants to add food to an existing order or make a new order starting with that food
//have two separate renders for the two cases, in which I update the state
//if existing order, look thru a list of user orders and add food to that order
//if no order, make a new order and add to that
export default CreateOrderModal
