import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as reviewActions from '../../store/review';
// import './createreviewmodal.css'

function CreateReviewModal({foodId}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [errors, setErrors] = useState([]);

    function isOnlyWhitespace(str) {
        return !str.trim().length;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = {};
        if (isOnlyWhitespace(review)) {
            errors.review = "Review cannot be empty";
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const payload = {
            review,
            rating,
            foodId
        }

        const data = await dispatch(reviewActions.createReviewThunk(payload));
        if (data.errors) {
            setErrors(data.errors);
        } else {
            setReview('');
            setRating(0);
            setErrors([]);
        }
    }

    return (
        <div className='create-review-modal-container'>
            <div className='create-review-modal'>
                <div className='create-review-modal-header'>
                    <h1>Create Review</h1>
                    <button onClick={() => history.goBack()}>X</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='create-review-modal-form'>
                        <div>
                            <label>Review</label>
                            <textarea
                                type='text'
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                required
                            />
                            {errors.review && <p>{errors.review}</p>}
                        </div>
                        <div>
                            <label>Rating</label>
                            <input
                                type='number'
                                min={0}
                                max={5}
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                required
                            />
                        </div>
                        <button type='submit'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateReviewModal
