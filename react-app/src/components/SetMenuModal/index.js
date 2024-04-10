import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as menuActions from "../../store/menu";

function SetMenuModal({menus, currMenuId, onClose}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(state => state.session.user);
    const currentMenu = useSelector(state => state.menu.currentMenu);
    const [menuId, setMenuId] = useState(currentMenu.id);

    const setMenu = (menuId) => {
        dispatch(menuActions.setCurrentMenuThunk(menuId))
    }

    console.log('menus inside setMenuModal: ', menus)
    return (
        <div className='set-menu-modal-container'>
            <div>
                <h1>Today's date is: </h1>
                <div>
                    <h1>Set Menu Below!</h1>
                    {menus.map(menu => (
                        <div className='curr-menu-tiles' key={menu.id}>
                            <h3>Menu ID: {menu.id}</h3>
                            <h3>Menu Name: {menu.name}</h3>
                            <div className='menu-foods'>
                                {menu?.foods?.length > 0 ? (
                                    menu.foods.map(food => (
                                        <div>
                                            <div key={food.id}>
                                                <h4>{food.name}</h4>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>
                                        <h4>No Food for this day</h4>
                                    </div>
                                )}
                            </div>
                            {menu?.foods.length > 0 && <button onClick={() => setMenu(menu?.id)}>Set as Menu</button>}
                        </div>
                    ))}
                </div>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    )
}

export default SetMenuModal
