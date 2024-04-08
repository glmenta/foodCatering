import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import * as foodActions from "../../store/food";
import * as menuActions from "../../store/menu";
import FoodDetailModal from "../FoodDetailModal";


import './foodpage.css'

function FoodPage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user)
    const foods = useSelector(state => Object.values(state.food.allFoods))
    const [isLoaded, setIsLoaded] = useState(false)
    const [isFoodModalOpen, setIsFoodModalOpen] = useState(false)
    const [foodId, setFoodId] = useState(null)


    useEffect(() => {
        setIsLoaded(false)
        Promise.all([dispatch(foodActions.getAllFoodsThunk())]).then(() => setIsLoaded(true))
    }, [dispatch])

    useEffect(() => {
        dispatch(menuActions.getAllMenusThunk())
        // dispatch(menuActions.getCurrentMenuThunk())
    }, [dispatch])

    useEffect(() => {
        dispatch(sessionActions.getAllUsersThunk())
    }, [dispatch])

    const openFoodModal = (id) => {
        setFoodId(id)
        setIsFoodModalOpen(true)
    }

    const closeFoodModal = () => {
        setIsFoodModalOpen(false)
        setFoodId(null)
    }

    console.log('FOODS', foods)

    return (
        <div>
            <h1>Home Page</h1>
            <div className='food-list'>
                { isLoaded && foods?.length > 0 && (
                    foods.map(food => (
                        <div className = 'food-item' onClick={() => openFoodModal(food.id)}>
                            <div className='food-item-contents'>
                                <li className='food-name'>{food?.name}</li>
                                <img src={food?.food_images[0]?.url} alt={food?.name} className='food-img'/>
                            </div>
                        </div>
                    ))
                )
                }
                {isFoodModalOpen && <FoodDetailModal isOpen={isFoodModalOpen} onClose={closeFoodModal} foodId={foodId} />}
            </div>
        </div>
    )
}

export default FoodPage
