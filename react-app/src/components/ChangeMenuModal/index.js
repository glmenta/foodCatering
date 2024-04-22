import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as menuActions from "../../store/menu";

function ChangeMenuModal({ isOpen, currentMenuId, onClose }) {
    const dispatch = useDispatch();
    const allMenus = useSelector(state => Object.values(state.menu.menus));
    const [error, setError] = useState("");

    useEffect(() => {
        dispatch(menuActions.getAllMenusThunk());
    }, [dispatch]);

    const changeMenu = (menuId) => {
        console.log('inside if', menuId, currentMenuId);
        if (menuId === currentMenuId) {

            setError("This menu is already set as current, please pick another one");
            return;
        }

        dispatch(menuActions.setCurrentMenuThunk(menuId));
        setError("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        isOpen &&
        <div className="change-menu-modal">
            <div className="change-menu-modal-content">
                <h1>Change Menu Below!</h1>
                {error && <div style={{ color: 'red' }}>{error}</div>}
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
