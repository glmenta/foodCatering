import { csrfFetch } from "./csrf";

const GET_ALL_FOOD_REVIEWS = "review/GET_ALL_REVIEWS";
const GET_REVIEW = "review/GET_REVIEW";
const CREATE_REVIEW = "review/CREATE_REVIEW";
const DELETE_REVIEW = "review/DELETE_REVIEW";

const getAllFoodReviews = (reviews) => ({
    type: GET_ALL_FOOD_REVIEWS,
    payload: reviews
})

const getReview = (review) => ({
    type: GET_REVIEW,
    payload: review
})

const createReview = (review) => ({
    type: CREATE_REVIEW,
    payload: review
})

const deleteReview = (review) => ({
    type: DELETE_REVIEW,
    payload: review
})


export const getAllReviewsByFoodIdThunk = (foodId) => async (dispatch) => {
    const response = await csrfFetch(`/api/foods/${foodId}/reviews`);
    if (response.ok) {
        const reviews = await response.json();
        dispatch(getAllFoodReviews(reviews));
        return reviews
    }
}

const initialState = {
    FoodReviews: {},
    review: {}
};

export default function reviewReducer(state = initialState, action) {
    let newState = { ...state };
    switch (action.type) {
        case GET_ALL_FOOD_REVIEWS:
            newState.FoodReviews = {};
            for (const review of action.payload.reviews) {
                newState.FoodReviews[review.id] = review
            }
            return newState
        case GET_REVIEW:
            newState.review = action.payload;
            return newState
        case CREATE_REVIEW:
            newState.review = action.payload;
            return newState
        case DELETE_REVIEW:
            newState.review = action.payload;
            return newState
        default:
            return state
    }
}
