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
        dispatch(menuActions.getCurrentMenuThunk())
    }, [dispatch])


    console.log('FOODS', foods)
    console.log('MENUS', menus)
    console.log('CURRENT MENU', currentMenu)
    if (!currentMenu) {
        <h1>Loading...</h1>
    }
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
            <div className='current-menu-container'>
                {currentMenu ? (
                    <div className='current-menu'>
                        <h2>Current Menu</h2>
                        <div className='current-menu-contents'>
                            <ul>
                                {currentMenu.current_menu?.foods.map(food => (
                                    <li key={food.id}>
                                        <div className='menu-food'>
                                            <h3 className='menu-food-name'>{food.name}</h3>
                                            <p className='menu-food-description'>Description: {food.description}</p>
                                            <p className='menu-food-price'>Price: ${food.price}</p>
                                            <img src={food?.food_images[0]?.url} alt={food.name} className='food-img'/>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2>No menu for today!</h2>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HomePage
