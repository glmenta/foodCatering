import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as messageActions from "../../store/message";
import * as orderActions from "../../store/order";
import * as sessionActions from "../../store/session";

function OrderMessageModal({ orderId, isOpen, onClose }) {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    return (
        <div>

        </div>
    )
}

export default OrderMessageModal
