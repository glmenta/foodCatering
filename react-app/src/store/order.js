import { csrfFetch } from "./csrf";

const GET_ALL_ORDERS = "order/GET_ALL_ORDERS";
const GET_USER_ORDERS = "order/GET_USER_ORDERS";
const GET_ORDER = "order/GET_ORDER";
const GET_ORDER_FOODS_BY_ID = "order/GET_ORDER_FOODS_BY_ID"
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

export const getOrderFoodsById = (orderFoods) => ({
    type: GET_ORDER_FOODS_BY_ID,
    payload: orderFoods
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
    const response = await csrfFetch("/api/orders");
    if (response.ok) {
        const orders = await response.json();
        dispatch(getAllOrders(orders));
        return orders
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
    const response = await csrfFetch("/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
    });
    if (response.ok) {
        const newOrder = await response.json();
        dispatch(createOrder(newOrder));
        return newOrder
    }
}

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

const initialState = {
    currentUserOrders: {},
    allOrders: {}
}

export default function orderReducer(state = initialState, action) {
    let newState = { ...state }
    switch (action.type) {
        case GET_ALL_ORDERS:
            for (const order of action.payload.orders) {
                newState.allOrders[order.id] = order
            }
            return newState
        case GET_USER_ORDERS:
            for (const order of action.payload.orders) {
                newState.currentUserOrders[order.id] = order
            }
            return newState
        case GET_ORDER:
            newState.order = action.payload;
            return newState
        default:
            return state
    }
}
