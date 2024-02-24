import { csrfFetch } from "./csrf";

const GET_ALL_MESSAGES = "message/GET_ALL_MESSAGES";
const GET_USER_MESSAGES = "message/GET_USER_MESSAGES";
const GET_ORDER_MESSAGES = "message/GET_ORDER_MESSAGES";
const GET_MESSAGE = "message/GET_MESSAGE";
const CREATE_MESSAGE = "message/CREATE_MESSAGE";
const DELETE_MESSAGE = "message/DELETE_MESSAGE";

export const getAllMessages = (messages) => {
    return {
        type: GET_ALL_MESSAGES,
        messages
    }
}

export const getUserMessages = (messages) => {
    return {
        type: GET_USER_MESSAGES,
        messages
    }
}

export const getOrderMessages = (messages) => {
    return {
        type: GET_ORDER_MESSAGES,
        messages
    }
}

export const getMessage = (message) => {
    return {
        type: GET_MESSAGE,
        message
    }
}

export const createMessage = (message) => {
    return {
        type: CREATE_MESSAGE,
        message
    }
}

export const deleteMessage = (message) => {
    return {
        type: DELETE_MESSAGE,
        message
    }
}


export const getMessages = () => async (dispatch) => {
    const response = await csrfFetch('/api/messages/all');
    const messages = await response.json();
    dispatch(getAllMessages(messages));
    return messages;
}

export const getUserMessagesThunk = (userId) => async (dispatch) => {
    const response = await csrfFetch(`/api/users/${userId}/messages`);
    if (response.ok) {
        const messages = await response.json();
        dispatch(getUserMessages(messages));
        return messages
    }
}

export const getOrderMessagesThunk = (orderId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/messages/order/${orderId}`);
        if (response.ok) {
            const messages = await response.json();
            dispatch(getOrderMessages(messages));
            return messages
        }
    } catch (error) {
        console.log(error);
    }
}

export const getMessageThunk = (messageId) => async (dispatch) => {
    const response = await csrfFetch(`/api/messages/${messageId}`);
    if (response.ok) {
        const message = await response.json();
        dispatch(getMessage(message));
        return message
    }
}

export const createMessageThunk = (message) => async (dispatch) => {
    const response = await csrfFetch('/api/messages', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    });
    if (response.ok) {
        const newMessage = await response.json();
        dispatch(createMessage(newMessage));
        return newMessage
    }
}

export const deleteMessageThunk = (message) => async (dispatch) => {
    const response = await csrfFetch(`/api/messages/${message.id}`, {
        method: "DELETE",
    });
    if (response.ok) {
        const deletedMessage = await response.json();
        dispatch(deleteMessage(deletedMessage));
        return deletedMessage
    }
}

let initialState ={
    allMessages: {},
    userMessages: {},
    orderMessages: {},
    message: {}
}

export default function messageReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_MESSAGES:
            return {
                ...state,
                allMessages: action.messages
            }
        case GET_USER_MESSAGES:
            return {
                ...state,
                userMessages: action.messages
            }
        case GET_ORDER_MESSAGES:
            return {
                ...state,
                orderMessages: {
                    ...state.orderMessages,
                    [action.orderId]: action.messages
                }
            };
        case GET_MESSAGE:
            return {
                ...state,
                message: action.message
            }
        case CREATE_MESSAGE:
            return {
                ...state,
                allMessages: {
                    ...state.allMessages,
                    [action.message.id]: action.message
                }
            }
        case DELETE_MESSAGE:
            const { [action.message.id]: deletedMessage, ...rest } = state.allMessages;
            return {
                ...state,
                allMessages: rest
            }
        default:
            return state
        }
}
