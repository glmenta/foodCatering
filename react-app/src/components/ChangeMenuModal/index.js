import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as menuActions from "../../store/menu";

function ChangeMenuModal({ onMenuChange, isOpen, currentMenuId, onClose }) {
    const dispatch = useDispatch();
    const allMenus = useSelector(state => Object.values(state.menu.menus));
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        dispatch(menuActions.getAllMenusThunk());
    }, [dispatch]);

    const changeMenu = async (menuId) => {
        console.log('Attempting to change menu from', currentMenuId, 'to', menuId);
        if (menuId === currentMenuId) {
            setError("This menu is already set as current, please pick another one.");
            return;
        }

        setError("");
        setIsLoading(true);
        try {
            await dispatch(menuActions.setCurrentMenuThunk(menuId));
            onMenuChange();
            onClose();
        } catch (error) {
            setError("Failed to change the menu. Please try again.");
            console.error("Error changing menu:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="change-menu-modal">
            <div className="change-menu-modal-content">
                <h1>Change Menu Below!</h1>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                <ul>
                    {allMenus.map((menu) => (
                        <li key={menu.id}>
                            <button onClick={() => changeMenu(menu.id)} disabled={isLoading}>
                                {menu.name}
                            </button>
                        </li>
                    ))}
                </ul>
                <button onClick={onClose} disabled={isLoading}>Close</button>
            </div>
        </div>
    );
}

export default ChangeMenuModal;
