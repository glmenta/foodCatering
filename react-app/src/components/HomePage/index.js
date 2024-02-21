import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as foodActions from "../../store/food";
import * as menuActions from "../../store/menu";
import './homepage.css'

function HomePage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user)
    const foods = useSelector(state => Object.values(state.food.allFoods))
    const menus = useSelector(state => Object.values(state.menu.menus))
    const currentMenu = useSelector(state => state.menu.currentMenu)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(false)
        Promise.all([dispatch(foodActions.getAllFoodsThunk())]).then(() => setIsLoaded(true))
    }, [dispatch])

    useEffect(() => {
        dispatch(menuActions.getAllMenusThunk())
    }, [dispatch])

    useEffect(() => {
        dispatch(menuActions.getCurrentMenuThunk())
    }, [dispatch])

    console.log('FOODS', foods)
    console.log('MENUS', menus)
    console.log('CURRENT MENU', currentMenu)
    if (!currentMenu) {
        return <h1>Loading...</h1>
    }

    const navigateToFoodPage = () => {
        history.push('/foods')
    }

    return (
        <div>
            <h1>Home Page</h1>
            <div className='food-button'>
                <button onClick={navigateToFoodPage}>View All Foods</button>
            </div>
            <div className='current-menu-container'>
                {isLoaded && Object.keys(currentMenu).length > 0 ? (
                    <div className='current-menu'>
                        <h2>Current Menu</h2>
                        <div className='current-menu-contents'>
                            <ul>
                                {currentMenu?.current_menu?.foods.map(food => (
                                    <li key={food.id}>
                                        <div className='menu-food'>
                                            <h3 className='menu-food-name'>{food?.name}</h3>
                                            <p className='menu-food-description'>Description: {food?.description}</p>
                                            <p className='menu-food-price'>Price: ${food.price}</p>
                                            <img src={food?.food_images[0]?.url} alt={food?.name} className='food-img'/>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2>No menu for today! Please check again later.</h2>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HomePage
