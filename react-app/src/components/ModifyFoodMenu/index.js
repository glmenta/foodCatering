import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as menuActions from '../../store/menu';
import * as foodActions from '../../store/food';

const FoodManagementModal = ({ handleMenuChange, menuId, isOpen, onClose }) => {
    const dispatch = useDispatch();
    const allFoods = useSelector(state => Object.values(state.food.allFoods));
    const menuFoods = useSelector(state => Object.values(state.menu.menuFoods) || []);
    console.log('menuFoods: ', menuFoods)
    const [operation, setOperation] = useState('add');
    const [selectedFoodId, setSelectedFoodId] = useState('');
    const selectRef = useRef(null);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const parsedId = parseInt(selectedFoodId, 10);
        if (operation === 'add') {
            dispatch(menuActions.addFoodToMenuThunk(menuId, { food: [parsedId] }));
        } else {
            dispatch(menuActions.removeFoodFromMenuThunk(menuId, { food: [parsedId] }));
        }
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
