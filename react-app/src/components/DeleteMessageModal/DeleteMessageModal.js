import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteMessageThunk } from "../../store/message";

function DeleteMessageModal({ messageId, isOpen, onClose }) {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen]);

    const handleClose = () => {
        setShowModal(false);
        onClose();
    };

    const handleDelete = async () => {
        try {
            const result = await dispatch(deleteMessageThunk({ id: messageId }));
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
                    <h2 className="title">Delete Message</h2>
                    {errors.length > 0 && (
                        <div className="notification is-danger">
                            <ul>
                                {errors.map((error, idx) => (
                                    <li key={idx}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <p>Are you sure you want to delete this message?</p>
                    <div className="field is-grouped">
                        <div className="control">
                            <button className="button is-danger" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                        <div className="control">
                            <button className="button" onClick={handleClose}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={handleClose}></button>
        </div>
    );
}

export default DeleteMessageModal;
