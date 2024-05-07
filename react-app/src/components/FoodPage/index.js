import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as foodActions from "../../store/food";
import * as menuActions from "../../store/menu";
import * as sessionActions from "../../store/session";
import FoodDetailModal from "../FoodDetailModal";
import ManageFoodModal from "../ManageFoodModal";
import './foodpage.css';

function FoodPage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const foods = useSelector(state => Object.values(state.food.allFoods));
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [foodId, setFoodId] = useState(null);

    useEffect(() => {
        setIsLoaded(false);
        setError(null);
        Promise.all([dispatch(foodActions.getAllFoodsThunk())])
            .then(() => setIsLoaded(true))
            .catch(err => {
                setError("Failed to fetch foods. Please try again later.");
                setIsLoaded(true);
            });
    }, [dispatch]);

    useEffect(() => {
        dispatch(menuActions.getAllMenusThunk());
    }, [dispatch]);

    useEffect(() => {
        dispatch(sessionActions.getAllUsersThunk());
    }, [dispatch]);

    const openFoodModal = (id) => {
        setFoodId(id);
        setIsFoodModalOpen(true);
    };

    const closeFoodModal = () => {
        setIsFoodModalOpen(false);
        setFoodId(null);
    };

    const openManageModal = (id = null) => {
        setFoodId(id);
        setIsManageModalOpen(true);
    };

    const closeManageModal = () => {
        setIsManageModalOpen(false);
        setFoodId(null);
    };

    return (
        <div>
            <h1>Foods!</h1>
            <button onClick={() => openManageModal()}>Add New Food</button>
            {error && <p className="error">{error}</p>}
            <div className='food-list'>
                {!isLoaded ? <p>Loading...</p> : (
                    foods.length > 0 ? (
                        foods.map(food => (
                            <div className='food-item' key={food.id} onClick={() => openFoodModal(food.id)} onKeyPress={(e) => e.key === 'Enter' && openFoodModal(food.id)} tabIndex={0} role="button">
                                <div className='food-item-contents'>
                                    <li className='food-name'>{food.name}</li>
                                    <img src={food.food_images[0]?.url} alt={food.name} className='food-img'/>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        openManageModal(food.id);
                                    }}>Edit</button>
                                </div>
                            </div>
                        ))
                    ) : <p>No foods available.</p>
                )}
                {isFoodModalOpen && <FoodDetailModal isOpen={isFoodModalOpen} onClose={closeFoodModal} foodId={foodId} />}
                {isManageModalOpen && <ManageFoodModal isOpen={isManageModalOpen} onClose={closeManageModal} foodId={foodId} />}
            </div>
        </div>
    );
}

export default FoodPage;
