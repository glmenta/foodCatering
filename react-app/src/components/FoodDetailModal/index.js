import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './fooddetail.css'
import * as reviewActions from '../../store/review';
import * as sessionActions from '../../store/session';
import * as foodActions from '../../store/food';
import CreateReviewModal from '../CreateReviewModal';

function FoodDetailModal({ isOpen, onClose, foodId }) {
    const dispatch = useDispatch();
    const all_foods = useSelector(state => Object.values(state.food.allFoods))
    const avg_rating = useSelector(state => state.food.currentFoodRating) || 0
    const users = useSelector(state => state.session.users)
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const food = all_foods.find(food => food.id === foodId)
    const reviews = useSelector(state => state.review.allReviews)

    useEffect(() => {
        dispatch(reviewActions.getAllReviewsByFoodIdThunk(foodId));
        dispatch(sessionActions.getAllUsersThunk());
    }, [dispatch, foodId]);

    useEffect(() => {
        dispatch(foodActions.getFoodAvgRatingThunk(foodId))
        .catch(err => {
            console.log(err)
        })
    }, [dispatch, foodId]);


    console.log('food: ', food)
    console.log('food_reviews: ', food?.reviews)
    console.log('user_reviews: ', users)
    console.log('food_id: ', foodId)
    console.log('avg_rating: ', avg_rating)
    const getUserNameById = (userId) => {
        const user = users.users.find(user => user.id === userId);
        return user ? user.firstName : 'Unknown';
    };

    const openReviewModal = () => {
        setReviewModalOpen(true)
    }

    const closeReviewModal = () => {
        setReviewModalOpen(false)
    }

    return (
        isOpen &&
        <div className='food-detail-modal-container'>
            <div className='food-detail-modal'>
                <div className='food-detail-modal-header'>
                    <h1>{food?.name}</h1>
                    <button onClick={onClose}>X</button>
                </div>
                <div className='food-detail-modal-body'>
                    <img src={food?.food_images[0]?.url} alt={food?.name} className='food-img'/>
                    <p>{food?.description}</p>
                    <button onClick={openReviewModal}>Make A Review!</button>
                    {food?.reviews.length > 0 ? (
                        food?.reviews.map(review => (
                            <div className='food-review-container'>
                                <p>Rating: {avg_rating?.average_rating} / 5</p>
                                <p>{getUserNameById(review.user_id)}</p>

                                <div className='food-review'>
                                    <p>{review.rating}</p>
                                    <p>{review.review}</p>

                                </div>

                            </div>

                        ))

                    ) : (
                        <div className='food-review-container'>
                            <p>No reviews yet!</p>
                            <button onClick={openReviewModal}>Make A Review!</button>
                        </div>
                    )}

                </div>
            </div>

            <div className='review-modal'>
                    <div>
                        {reviewModalOpen && <CreateReviewModal onClose={closeReviewModal} isOpen={reviewModalOpen} foodId={foodId}/>}
                    </div>
                </div>
        </div>
    )
}

export default FoodDetailModal
