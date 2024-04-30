import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as menuActions from '../../store/menu';
import * as foodActions from '../../store/food';

const FoodManagementModal = ({ menuId, isOpen, onClose }) => {
    const dispatch = useDispatch();
    const foods = useSelector(state => Object.values(state.food.allFoods));
    const menuFoods = useSelector(state => Object.values(state.menu.menuFoods));
    const [operation, setOperation] = useState('add');
    const [selectedFoodId, setSelectedFoodId] = useState('');
    const selectRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            if (operation === 'add') {
                dispatch(foodActions.getAllFoodsThunk());
            } else if (operation === 'remove') {
                dispatch(menuActions.getMenuFoodsThunk(menuId));
            }
            setTimeout(() => {
                if (selectRef.current) {
                    selectRef.current.focus();
                }
            }, 100);
        }
    }, [dispatch, isOpen, operation, menuId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const parsedId = parseInt(selectedFoodId, 10);
        if (operation === 'add') {
            dispatch(menuActions.addFoodToMenuThunk(menuId, { food: [parsedId] }));
        } else {
            dispatch(menuActions.removeFoodFromMenuThunk(menuId, { food: [parsedId] }));
        }
        onClose();
    };

    if (!isOpen) return null;

    const currentFoods = operation === 'add' ? foods : menuFoods;

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
                        {currentFoods.map(food => (
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
