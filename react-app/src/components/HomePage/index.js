import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as foodActions from "../../store/food";
import './homepage.css'

function HomePage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user)
    const foods = useSelector(state => Object.values(state.food.allFoods))
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(false)
        Promise.all([dispatch(foodActions.getAllFoodsThunk())]).then(() => setIsLoaded(true))
    }, [dispatch])

    console.log('FOODS', foods)
    return (
        <div>
            <h1>Home Page</h1>
            <div className='food-list'>
                { isLoaded && foods.length > 0 && (
                    foods.map(food => (
                        <div className = 'food-item'>
                            <div className='food-item-contents'>
                                <li className='food-name'>{food.name}</li>
                                <img src={food?.food_images[0]?.url} alt={food.name} className='food-img'/>
                            </div>
                        </div>
                    ))
                )
                }
            </div>
        </div>
    )
}

export default HomePage
