import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as foodActions from "../../store/food";


function HomePage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user)
    const foods = useSelector(state => state.food.allFoods)
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
                        <li>{food.name}</li>
                    ))
                )
                }
            </div>
        </div>
    )
}

export default HomePage
