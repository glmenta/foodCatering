import { csrfFetch } from "./csrf";

const GET_ALL_FOODS = "food/GET_ALL_FOODS";
const GET_FOOD = "food/GET_FOOD";
const CREATE_FOOD = "food/CREATE_FOOD";
const UPDATE_FOOD = "food/UPDATE_FOOD";
const DELETE_FOOD = "food/DELETE_FOOD";
const GET_FOOD_AVG_RATING = "food/GET_FOOD_AVG_RATING";

export const getAllFoods = (foods) => {
    return {
        type: GET_ALL_FOODS,
        payload: foods
    }
}

export const getFood = (food) => {
    return {
        type: GET_FOOD,
        payload: food
    }
}
export const getFoodAvgRating = (avgRating) => {
    return {
        type: GET_FOOD_AVG_RATING,
        payload: avgRating
    }
}

export const createFood = (food) => {
    return {
        type: CREATE_FOOD,
        payload: food
    }
}

export const updateFood = (food) => {
    return {
        type: UPDATE_FOOD,
        payload: food
    }
}

export const deleteFood = (food) => {
    return {
        type: DELETE_FOOD,
        payload: food
    }
}

export const getAllFoodsThunk = () => async (dispatch) => {
    const response = await csrfFetch("/api/foods");
    if (response.ok) {
        const foods = await response.json();
        dispatch(getAllFoods(foods));
        return foods
    }
}

export const getFoodThunk = (foodId) => async (dispatch) => {
    const response = await csrfFetch(`/api/foods/${foodId}`);
    if (response.ok) {
        const food = await response.json();
        dispatch(getFood(food));
        return food
    }
}

export const createFoodThunk = (food) => async (dispatch) => {
    const response = await csrfFetch(`/api/foods/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(food)
    });
    if (response.ok) {
        const newFood = await response.json();
        dispatch(createFood(newFood));
        return newFood
    } else {
        const errors = await response.json();
        return errors
    }
}

export const updateFoodThunk = (food) => async (dispatch) => {
    const response = await csrfFetch(`/api/foods/${food.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(food)
    });
    if (response.ok) {
        const updatedFood = await response.json();
        dispatch(updateFood(updatedFood));
        return updatedFood
    } else {
        const errors = await response.json();
        return errors
    }
}

export const deleteFoodThunk = (foodId) => async (dispatch) => {
    const response = await csrfFetch(`/api/foods/${foodId}`, {
        method: "DELETE"
    });
    if (response.ok) {
        const deletedFood = await response.json();
        dispatch(deleteFood(deletedFood));
        return deletedFood
    }
}

export const getFoodAvgRatingThunk = (foodId) => async (dispatch) => {
    const response = await csrfFetch(`/api/foods/${foodId}/ratings/average`);
    if (response.ok) {
        const avgRating = await response.json();
        dispatch(getFoodAvgRating(avgRating));
        return avgRating
    }
}

const initialState = {
    allFoods: {},
    food: {},
    currentFoodRating: 0
}

export default function foodReducer(state = initialState, action) {
    let newState = { ...state }
    switch (action.type) {
        case GET_ALL_FOODS:
            newState.allFoods = {};
            for (const food of action.payload.foods) {
                newState.allFoods[food.id] = food
            }
            return newState
        case GET_FOOD:
            newState.food = action.payload;
            return newState
        case CREATE_FOOD:
            newState.food = action.payload;
            return newState
        case UPDATE_FOOD:
            newState.food = action.payload;
            return newState
        case DELETE_FOOD:
            newState.food = action.payload;
            return newState
        case GET_FOOD_AVG_RATING:
            newState.currentFoodRating = action.payload;
            return newState
        default:
            return state
    }
}
