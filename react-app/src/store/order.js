import { csrfFetch } from "./csrf";

const GET_ALL_ORDERS = "order/GET_ALL_ORDERS";
const GET_USER_ORDERS = "order/GET_USER_ORDERS";
const GET_ORDER = "order/GET_ORDER";
const ADD_FOOD_TO_ORDER = "order/ADD_FOOD_TO_ORDER"
const REMOVE_FOOD_FROM_ORDER = "order/REMOVE_FOOD_FROM_ORDER"
const UPDATE_FOOD_ORDER_QUANTITIES = "order/UPDATE_FOOD_ORDER_QUANTITIES"
const CREATE_ORDER = "order/CREATE_ORDER";
const UPDATE_ORDER = "order/UPDATE_ORDER";
const DELETE_ORDER = "order/DELETE_ORDER";

export const getAllOrders = (orders) => ({
    type: GET_ALL_ORDERS,
    payload: orders
})

export const getUserOrders = (orders) => ({
    type: GET_USER_ORDERS,
    payload: orders
})
export const getOrder = (order) => ({
    type: GET_ORDER,
    payload: order
})

export const addFoodToOrder = (food, order_id) => ({
    type: ADD_FOOD_TO_ORDER,
    payload: { food, order_id }
})

export const removeFoodFromOrder = (food, order_id) => ({
    type: REMOVE_FOOD_FROM_ORDER,
    payload: { food, order_id }
})

export const updateFoodOrderQuantities = (food, order_id) => ({
    type: UPDATE_FOOD_ORDER_QUANTITIES,
    payload: { food, order_id }
})

export const createOrder = (order) => ({
    type: CREATE_ORDER,
    payload: order
})

export const updateOrder = (order) => ({
    type: UPDATE_ORDER,
    payload: order
})

export const deleteOrder = (order) => ({
    type: DELETE_ORDER,
    payload: order
})

export const getAllOrdersThunk = () => async (dispatch) => {
    const response = await csrfFetch("/api/orders/");
    try {
        if (response.ok) {
            const orders = await response.json();
            dispatch(getAllOrders(orders));
            return orders
        }
    } catch (error) {
        console.log(error);
    }
}

export const getOrderThunk = (orderId) => async (dispatch) => {
    const response = await csrfFetch(`/api/orders/${orderId}`);
    if (response.ok) {
        const order = await response.json();
        dispatch(getOrder(order));
        return order
    }
}

export const getUserOrdersThunk = (userId) => async (dispatch) => {
    const response = await csrfFetch(`/api/users/${userId}/orders`);
    if (response.ok) {
        const orders = await response.json();
        dispatch(getUserOrders(orders));
        return orders
    }
}

export const createOrderThunk = (order) => async (dispatch) => {
    const response = await csrfFetch("/api/orders/new", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
    });
    if (response.ok) {
        const data = await response.json();
        console.log('data inside thunk: ', data)
        dispatch(createOrder(data));
        return data;
    }
};



export const updateOrderThunk = (order) => async (dispatch) => {
    const response = await csrfFetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
    });
    if (response.ok) {
        const updatedOrder = await response.json();
        dispatch(updateOrder(updatedOrder));
        return updatedOrder
    }
}

export const deleteOrderThunk = (orderId) => async (dispatch) => {
    const response = await csrfFetch(`/api/orders/${orderId}`, {
        method: "DELETE",
    });
    if (response.ok) {
        const deletedOrder = await response.json();
        dispatch(deleteOrder(deletedOrder));
        return deletedOrder
    }
}

export const addFoodToOrderThunk = (orderId, foodOrderId, quantity) => async (dispatch) => {
    console.log('inside addFoodToOrderThunk', orderId, foodOrderId);
    const response = await csrfFetch(`/api/orders/${orderId}/add/${foodOrderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({quantity})
    });
    if (response.ok) {
        console.log('response: ', response)
        const newFood = await response.json();
        dispatch(addFoodToOrder(newFood, orderId));
        return newFood
    }
}

export const removeFoodOrderFromOrderThunk = (foodOrderId, orderId) => async (dispatch) => {
    console.log('inside remove food from order thunk: ', foodOrderId, orderId);
    const response = await csrfFetch(`/api/orders/${orderId}/delete/${foodOrderId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
        const deletedFood = await response.json();
        dispatch(removeFoodFromOrder(deletedFood, orderId));
        return deletedFood
    }
}

export const updateFoodOrderQuantitiesThunk = (orderId, foodOrderId, quantity) => async (dispatch) => {
    console.log('inside thunk: ', orderId, foodOrderId, quantity);
    const response = await csrfFetch(`/api/orders/${orderId}/update/${foodOrderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({quantity})
    });
    if (response.ok) {
        const updatedFood = await response.json();
        dispatch(updateFoodOrderQuantities(orderId, foodOrderId, quantity));
        return updatedFood
    }
}

const initialState = {
    currentUserOrders: {},
    allOrders: []
}

export default function orderReducer(state = initialState, action) {
    let newState = { ...state }
    switch (action.type) {
        case GET_ALL_ORDERS:
            return {
                ...state,
                allOrders: action.payload
            };
        case GET_USER_ORDERS:
            for (const order of action.payload.orders) {
                newState.currentUserOrders[order.id] = order
            }
            return newState
        case GET_ORDER:
            newState.order = action.payload;
            return newState
        case CREATE_ORDER:
            console.log('payload', action.payload)
            newState.allOrders.push(action.payload.order)
            return newState
        case UPDATE_ORDER:
            newState.order = action.payload;
            return newState
        case DELETE_ORDER:
            newState.order = action.payload;
            return newState
        case ADD_FOOD_TO_ORDER:
            return {
                ...state,
                currentUserOrders: {
                    ...state.currentUserOrders,
                    [action.payload.orderId]: action.payload.order
                }
            };
        case REMOVE_FOOD_FROM_ORDER:
            return {
                ...state,
                currentUserOrders: {
                    ...state.currentUserOrders,
                    [action.payload.orderId]: action.payload.order
                }
            };
        case UPDATE_FOOD_ORDER_QUANTITIES:
            return {
                ...state,
                currentUserOrders: {
                    ...state.currentUserOrders,
                    [action.payload.orderId]: action.payload.order
                }
            }
        default:
            return state
    }
}
