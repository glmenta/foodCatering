import {csrfFetch} from "./csrf";
// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const GET_ALL_USERS = "session/GET_ALL_USERS";
const GET_USER_FOOD_ORDERS = "session/GET_USER_FOOD_ORDERS";

const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const removeUser = () => ({
	type: REMOVE_USER,
});

const getAllUsers = (users) => ({
	type: GET_ALL_USERS,
	payload: users
})

const getUserFoodOrders = (foodOrders) => ({
	type: GET_USER_FOOD_ORDERS,
	payload: foodOrders
})

export const authenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const login = (email, password) => async (dispatch) => {
	const response = await fetch("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};

export const logout = () => async (dispatch) => {
	const response = await fetch("/api/auth/logout", {
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		dispatch(removeUser());
	}
};

export const signUp = (username, email, password) => async (dispatch) => {
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username,
			email,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ["An error occurred. Please try again."];
	}

};

export const getAllUsersThunk = () => async (dispatch) => {
	const response = await csrfFetch("/api/users");
	if (response.ok) {
		const users = await response.json();
		dispatch(getAllUsers(users));
		return users
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
const initialState = { user: null, userFoodOrders: {} };
export default function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			return { user: action.payload };
		case REMOVE_USER:
			return { user: null };
		case GET_ALL_USERS:
			return { ...state, users: action.payload }
		case GET_USER_FOOD_ORDERS:
			return { ...state, userFoodOrders: action.payload }
		default:
			return state;
	}
}
