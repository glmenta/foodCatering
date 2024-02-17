import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './fooddetail.css'
import * as reviewActions from '../../store/review';
import * as sessionActions from '../../store/session';

function FoodDetailModal({ isOpen, onClose, foodId }) {
    const dispatch = useDispatch();
    const all_foods = useSelector(state => Object.values(state.food.allFoods))

    const food = all_foods.find(food => food.id === foodId)
    useEffect(() => {
        dispatch(reviewActions.getAllReviewsByFoodIdThunk(foodId))
    }, [dispatch, foodId])

    useEffect(() => {
        dispatch(sessionActions.getAllUsersThunk())
    }, [dispatch])
    const users = useSelector(state => state.session.users)
    console.log('food: ', foodId, food)
    console.log('food_reviews: ', food?.reviews)
    console.log('user_reviews: ', users)
    const getUserNameById = (userId) => {
        const user = users.users.find(user => user.id === userId);
        return user ? user.firstName : 'Unknown';
    };
    return (
        <div>
            <div className='food-detail-modal'>
                <div className='food-detail-modal-header'>
                    <h1>{food?.name}</h1>
                    <button onClick={onClose}>X</button>
                </div>
                <div className='food-detail-modal-body'>
                    <img src={food?.food_images[0]?.url} alt={food?.name} className='food-img'/>
                    <p>{food?.description}</p>
                    {food?.reviews?.map(review => (
                        <div>
                            <p>{getUserNameById(review.user_id)}</p>
                            <p>{review?.rating} </p>
                            <p>{review?.review}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FoodDetailModal
