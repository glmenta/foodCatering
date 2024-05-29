import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMessageThunk } from "../../store/message";

function OrderMessageModal({ orderId, isOpen, onClose }) {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen]);

    const handleClose = () => {
        setShowModal(false);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const newMessage = {
            orderId,
            message
        };

        try {
            const result = await dispatch(createMessageThunk(newMessage));
            if (result.errors) {
                setErrors(result.errors);
            } else {
                handleClose();
            }
        } catch (error) {
            setErrors([error.message]);
        }
    };

    return (
        <div className={`modal ${showModal ? "is-active" : ""}`}>
            <div className="modal-background" onClick={handleClose}></div>
            <div className="modal-content">
                <div className="box">
                    <h2 className="title">Send Message</h2>
                    <form onSubmit={handleSubmit}>
                        {errors.length > 0 && (
                            <div className="notification is-danger">
                                <ul>
                                    {errors.map((error, idx) => (
                                        <li key={idx}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="field">
                            <label className="label">Message</label>
                            <div className="control">
                                <textarea
                                    className="textarea"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <div className="field is-grouped">
                            <div className="control">
                                <button type="submit" className="button is-link">
                                    Send
                                </button>
                            </div>
                            <div className="control">
                                <button type="button" className="button" onClick={handleClose}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={handleClose}></button>
        </div>
    );
}

export default OrderMessageModal;
