import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as menuActions from '../../store/menu';
import * as foodActions from '../../store/food';

const FoodManagementModal = ({ handleMenuChange, menuId, isOpen, onClose }) => {
    const dispatch = useDispatch();
    const allFoods = useSelector(state => Object.values(state.food.allFoods));
    const menuFoods = useSelector(state => Object.values(state.menu.menuFoods) || []);
    const currentMenu = useSelector(state => state.menu.currentMenu);
    const [operation, setOperation] = useState('add');
    const [selectedFoodId, setSelectedFoodId] = useState('');
    const selectRef = useRef(null);

    console.log('menuFoods: ', menuFoods)
    console.log('menuId: ', menuId)
    console.log('currentMenu', currentMenu.current_menu)

    useEffect(() => {
        dispatch(foodActions.getAllFoodsThunk());
        dispatch(menuActions.getMenuFoodsThunk(menuId));
    }, [dispatch, menuId, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                if (selectRef.current) {
                    selectRef.current.focus();
                }
            }, 100);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const parsedId = parseInt(selectedFoodId, 10);
        const action = operation === 'add'
            ? menuActions.addFoodToMenuThunk(menuId, { food: [parsedId] })
            : menuActions.removeFoodFromMenuThunk(menuId, { food: [parsedId] });

        await dispatch(action);
        handleMenuChange();
        onClose();
    };

    if (!isOpen) return null;

    const availableFoods = operation === 'add'
        ? allFoods.filter(food => !menuFoods.find(mFood => mFood.id === food.id))
        : menuFoods;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="modal-close" onClick={onClose}>&times;</span>
                <h2>{operation === 'add' ? 'Add Food to Menu' : 'Remove Food from Menu'}</h2>
                <form onSubmit={handleSubmit} className="modal-form">
                    <label htmlFor="foodSelect">Select Food:</label>
                    <select
                        ref={selectRef}
                        id="foodSelect"
                        value={selectedFoodId}
                        onChange={e => setSelectedFoodId(e.target.value)}
                        required
                    >
                        <option value="">Select a food</option>
                        {availableFoods.map(food => (
                            <option key={food.id} value={food.id}>{food.name}</option>
                        ))}
                    </select>
                    <div>
                        <button type="button" onClick={() => setOperation('add')}>Add</button>
                        <button type="button" onClick={() => setOperation('remove')}>Remove</button>
                    </div>
                    <button type="submit">{operation === 'add' ? 'Add Food' : 'Remove Food'}</button>
                </form>
            </div>
        </div>
    );
};

export default FoodManagementModal;
