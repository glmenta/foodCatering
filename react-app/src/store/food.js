import { csrfFetch } from "./csrf";

const GET_ALL_FOODS = "food/GET_ALL_FOODS";
const GET_FOOD = "food/GET_FOOD";
const CREATE_FOOD = "food/CREATE_FOOD";
const UPDATE_FOOD = "food/UPDATE_FOOD";
const DELETE_FOOD = "food/DELETE_FOOD";

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
const initialState = {
    allFoods: {},
    food: {}
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
        default:
            return state
    }
}
