import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as foodActions from "../../store/food";
import * as menuActions from "../../store/menu";

export const CreateMenuModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const check_admin = useSelector(state => state.session.user?.isAdmin === true);
    const foods = useSelector(state => Object.values(state.food.allFoods));
    const [name, setName] = useState('');
    const [food, setFood] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const [errors, setErrors] = useState({});

    console.log('foods: ', foods);

    function isOnlyWhitespace(str) {
        return !str.trim().length;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = {};

        if (isOnlyWhitespace(name)) {
            errors.name = "Please set a menu name";
        }

        if (Object.keys(food).length === 0) {
            errors.food = "Please select at least one food";
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const payload = {
            name,
            food,
            isActive
        }

        const response = await dispatch(menuActions.createMenuThunk(payload));

        if (response.errors) {
            setErrors(response.errors);
        } else {
            setName('');
            setFood([]);
            setIsActive(false);
            setErrors({});
            onClose();
        }
    }

    return (
        isOpen && check_admin && (
            <div className='create-menu-modal'>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Menu Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <span className="error">{errors.name}</span>}
                    </div>
                    <div>
                        <label>Select A Food!</label>
                        <select
                            value={food}
                            onChange={(e) => setFood(e.target.value)}
                        >
                            <option value="">Select a food</option>
                            {foods.map(food => (
                                <option key={food.id} value={food.id}>{food.name}</option>
                            ))}
                        </select>
                        {errors.food && <span className="error">{errors.food}</span>}
                    </div>
                    <div>
                        <label>Is Active?</label>
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                    </div>
                    <button type="submit">Create Menu</button>
                </form>
                <button onClick={onClose}>Close</button>
            </div>
        )
    );
}
