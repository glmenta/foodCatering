import { csrfFetch } from "./csrf";

const GET_ALL_FOODS = "food/GET_ALL_FOODS";
const GET_FOOD = "food/GET_FOOD";
const CREATE_FOOD = "food/CREATE_FOOD";
const UPDATE_FOOD = "food/UPDATE_FOOD";
const DELETE_FOOD = "food/DELETE_FOOD";
const GET_FOOD_AVG_RATING = "food/GET_FOOD_AVG_RATING";
const GET_FOOD_ORDERS = "food/GET_FOOD_ORDERS";
const GET_USER_FOOD_ORDERS = "food/GET_USER_FOOD_ORDERS";
const CREATE_FOOD_ORDER = "food/CREATE_FOOD_ORDER";
const DELETE_FOOD_ORDER = "food/DELETE_FOOD_ORDER";
const REMOVE_FOOD_FROM_ORDER = "food/REMOVE_FOOD_FROM_ORDER";
const ADD_IMAGE_TO_FOOD = "food/ADD_IMAGE_TO_FOOD";
const REMOVE_IMAGE_FROM_FOOD = "food/REMOVE_IMAGE_FROM_FOOD";


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

export const getFoodOrders = (foodOrders) => {
    return {
        type: GET_FOOD_ORDERS,
        payload: foodOrders
    }
}

export const getUserFoodOrders = (foodOrders) => {
    return {
        type: GET_USER_FOOD_ORDERS,
        payload: foodOrders
    }
}

export const createFoodOrder = (food) => {
    return {
        type: CREATE_FOOD_ORDER,
        payload: food
    }
}

export const deleteFoodOrder = (food) => {
    return {
        type: REMOVE_FOOD_FROM_ORDER,
        payload: food
    }
}

export const addImageToFood = (foodId, image) => ({
    type: ADD_IMAGE_TO_FOOD,
    payload: { foodId, image }
});

export const removeImageFromFood = (foodId, imageId) => ({
    type: REMOVE_IMAGE_FROM_FOOD,
    payload: { foodId, imageId }
});


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
    const response = await csrfFetch(`/api/foods/${food.id}/edit`, {
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
    const response = await csrfFetch(`/api/foods/${foodId}/delete`, {
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

export const getFoodOrdersThunk = (foodId) => async (dispatch) => {
    const response = await csrfFetch(`/api/foods/${foodId}/orders`);
    if (response.ok) {
        const orders = await response.json();
        dispatch(getFoodOrders(orders));
        return orders
    }
}

export const getUserFoodOrdersThunk = (userId) => async (dispatch) => {
    const response = await csrfFetch(`/api/users/${userId}/foodorders`);
    if (response.ok) {
        const orders = await response.json();
        dispatch(getUserFoodOrders(orders));
        return orders
    }
}
export const createFoodOrderThunk = (food_order, user_id) => async (dispatch) => {
    console.log('inside thunk', food_order, user_id);
    try {
        const response = await csrfFetch(`/api/users/${user_id}/foodorders/new`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(food_order)
        });

        if (response.ok) {
            const order = await response.json();
            dispatch(createFoodOrder(order));
            return order;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create food order");
        }
    } catch (error) {
        console.error("Error creating food order:", error);
        if (error.response) {
            const errorData = await error.response.json();
            console.error("Server error data:", errorData);
        }
        throw error;
    }
};

export const deleteFoodOrderThunk = (user_id, food_order_id) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/users/${user_id}/foodorders/${food_order_id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            const deletedOrder = await response.json();
            dispatch(deleteFoodOrder(deletedOrder));
            console.log('inside thunk', deletedOrder);
            return deletedOrder;
        }

    } catch (error) {
        console.error("Error deleting food order:", error);
        if (error.response) {
            const errorData = await error.response.json();
            console.error("Server error data:", errorData);
        }
        throw error;
    }
}

export const addImageToFoodThunk = (foodId, imageUrl) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/foods/${foodId}/images/new`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: imageUrl }),
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(addImageToFood(foodId, data.image));
            return data.image;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add image");
        }
    } catch (error) {
        console.error("Error adding image:", error);
        throw error;
    }
};


export const removeImageFromFoodThunk = (foodId, imageId) => async (dispatch) => {
    console.log('inside thunk: ', foodId, imageId)
    try {
        const response = await csrfFetch(`/api/foods/${foodId}/images/${imageId}/delete`, {
            method: "DELETE",
        });

        if (response.ok) {
            console.log('inside thunk: ', response)
            const data = await response.json();
            dispatch(removeImageFromFood(foodId, imageId));
            return data;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete image");
        }
    } catch (error) {
        console.error("Error deleting image:", error);
        throw error;
    }
};


const initialState = {
    allFoods: {},
    food: {},
    currentUserFoodOrders: {},
    currentFoodOrders: {},
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
        case GET_FOOD_ORDERS:
            newState.currentFoodOrders = action.payload;
            return newState
        case GET_USER_FOOD_ORDERS:
            newState.currentUserFoodOrders = action.payload;
            return newState
        case CREATE_FOOD_ORDER:
            newState.currentFoodOrders[action.payload.id] = action.payload;
            return newState
        case DELETE_FOOD_ORDER:
            console.log('inside delete food order', action.payload);
            delete newState.currentFoodOrders[action.payload.id];
            return newState
        case ADD_IMAGE_TO_FOOD:
            if (!newState.allFoods[action.payload.foodId].images) {
                newState.allFoods[action.payload.foodId].images = [];
            }
            newState.allFoods[action.payload.foodId].images.push(action.payload.image);
            return newState;
        case REMOVE_IMAGE_FROM_FOOD:
            const food = newState.allFoods[action.payload.foodId];
            if (food && food.food_images) {
                food.food_images = food.food_images.filter(image => image.id !== action.payload.imageId);
            }
            return newState;
        default:
            return state
    }
}
