import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as menuActions from "../../store/menu";

function ChangeMenuModal({ menuId, isOpen, onClose }) {
    const dispatch = useDispatch();
    const allMenus = useSelector(state => Object.values(state.menu.allMenus));

    // Handle menu change
    const changeMenu = (menuId) => {
        dispatch(menuActions.setCurrentMenuThunk(menuId));
        onClose(); // Close modal after changing the menu
    };

    if (!isOpen) return null;

    return (
        <div className="change-menu-modal">
            <div className="change-menu-modal-content">
                <h1>Change Menu Below!</h1>
                <ul>
                    {allMenus.map((menu) => (
                        <li key={menu.id}>
                            <button onClick={() => changeMenu(menu.id)}>
                                {menu.name}
                            </button>
                        </li>
                    ))}
                </ul>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default ChangeMenuModal;
