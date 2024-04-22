import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as menuActions from "../../store/menu";

function SetMenuModal({ menus, currMenuId, onClose }) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const currentMenu = useSelector(state => state.menu.currentMenu);
    const [menuId, setMenuId] = useState(currentMenu?.id || currMenuId);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const setMenu = async (menuId) => {
        setLoading(true);
        try {
            await dispatch(menuActions.setCurrentMenuThunk(menuId));
            setSelectedMenu(menus.find(menu => menu.id === menuId));
            setLoading(false);
        } catch (err) {
            setError('Failed to set the menu');
            setLoading(false);
        }
    };

    return (
        <div className='set-menu-modal-container'>
            <div>
                <h1>Today's date is: {new Date().toLocaleDateString()}</h1>
                <div>
                    <h1>Set Menu Below!</h1>
                    {menus.map(menu => (
                        <div className='curr-menu-tiles' key={menu.id}>
                            <h3>Menu ID: {menu.id}</h3>
                            <h3>Menu Name: {menu.name}</h3>
                            <div className='menu-foods'>
                                {menu?.foods?.length > 0 ? (
                                    menu.foods.map(food => (
                                        <div key={food.id}>
                                            <h4>{food.name}</h4>
                                        </div>
                                    ))
                                ) : (
                                    <div><h4>No Food for this day</h4></div>
                                )}
                            </div>
                            <button onClick={() => setMenu(menu.id)}>Set as Menu</button>
                        </div>
                    ))}
                </div>
                {error && <p className="error">{error}</p>}
                {loading && <p>Loading...</p>}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default SetMenuModal;
