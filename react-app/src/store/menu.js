import { csrfFetch } from "./csrf";
import { getAllFoods } from "./food";
const GET_ALL_MENUS = "menu/GET_ALL_MENUS";
const GET_MENU = "menu/GET_MENU";
const GET_MENU_FOODS = "menu/GET_MENU_FOODS";
const GET_CURRENT_MENU = "menu/GET_CURRENT_MENU";
const SET_CURRENT_MENU = "menu/SET_CURRENT_MENU";
const CREATE_MENU = "menu/CREATE_MENU";
const UPDATE_MENU = "menu/UPDATE_MENU";
const DELETE_MENU = "menu/DELETE_MENU";
const ADD_FOOD_TO_MENU = "menu/ADD_FOOD_TO_MENU";
const REMOVE_FOOD_FROM_MENU = "menu/REMOVE_FOOD_FROM_MENU";

const getAllMenus = (menus) => ({
    type: GET_ALL_MENUS,
    payload: menus
})

const getMenu = (menu) => ({
    type: GET_MENU,
    payload: menu
})

const getMenuFoods = (menu) => ({
    type: GET_MENU_FOODS,
    payload: menu
})

const getCurrentMenu = (menu) => ({
    type: GET_CURRENT_MENU,
    payload: menu
})

const setCurrentMenu = (menu) => ({
    type: SET_CURRENT_MENU,
    payload: menu
})

const createMenu = (menu) => ({
    type: CREATE_MENU,
    payload: menu
})

const updateMenu = (menu) => ({
    type: UPDATE_MENU,
    payload: menu
})

const deleteMenu = (menu) => ({
    type: DELETE_MENU,
    payload: menu
})

const addFoodToMenu = (menu) => ({
    type: ADD_FOOD_TO_MENU,
    payload: menu
})

const removeFoodFromMenu = (menu) => ({
    type: REMOVE_FOOD_FROM_MENU,
    payload: menu
})

export const getAllMenusThunk = () => async (dispatch) => {
    try {
        const response = await csrfFetch("/api/menus");
        if (!response.ok) {
            throw new Error('Failed to fetch menus');
        }
        const menus = await response.json();
        dispatch(getAllMenus(menus));
        return menus;
    } catch (error) {
        console.error('Error fetching menus:', error);
    }
}

export const getMenuThunk = (menuId) => async (dispatch) => {
    const response = await csrfFetch(`/api/menus/${menuId}`);
    if (response.ok) {
        const menu = await response.json();
        dispatch(getMenu(menu));
        return menu
    }
}

export const getMenuFoodsThunk = (menuId) => async (dispatch) => {
    const response = await csrfFetch(`/api/menus/${menuId}/foods`);
    if (response.ok) {
        const menu = await response.json();
        dispatch(getMenuFoods(menu));
        return menu
    } else {
        const errors = await response.json();
        return errors
    }
}

export const getCurrentMenuThunk = () => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/menus/current`);
        if (!response.ok) {
            throw new Error('Failed to fetch current menu');
        }
        const menu = await response.json();
        dispatch(getCurrentMenu(menu));
        return menu;
    } catch (error) {
        console.error('Error fetching current menu:', error);
        try {
            const defFoodsResponse = await csrfFetch(`/api/foods`);
            if (!defFoodsResponse.ok) {
                throw new Error('Failed to fetch default foods');
            }
            const defaultFoods = await defFoodsResponse.json();
            dispatch(getAllFoods(defaultFoods));
            return defaultFoods;
        } catch (fallbackError) {
            console.error('Error fetching default foods:', fallbackError);
        }
    }
}

export const setCurrentMenuThunk = (menuId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/menus/set_current_menu/${menuId}`, {
            method: "PATCH",
            body: JSON.stringify({ menuId }),
        });
        if (!response.ok) {
            throw new Error('Failed to set current menu');
        }
        const menu = await response.json();
        dispatch(setCurrentMenu(menu));
        return menu;
    } catch (error) {
        console.error('Error setting current menu:', error);
    }
}

export const createMenuThunk = (menu) => async (dispatch) => {
    console.log('inside createMenuThunk', menu);
    try {
        const response = await csrfFetch(`/api/menus/new`, {
            method: "POST",
            body: JSON.stringify(menu),
        });
        if (!response.ok) {
            throw new Error('Failed to create menu');
        }
        const newMenu = await response.json();
        dispatch(createMenu(newMenu));
        return newMenu;
    } catch (error) {
        console.error('Error creating menu:', error);
    }
}

export const addFoodToMenuThunk = (menuId, foodDetails) => async (dispatch) => {
    try {
        const response = await fetch(`/api/menus/${menuId}/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(foodDetails),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Failed to add food");
        }
        dispatch(addFoodToMenu(data));  // Dispatch success action
    } catch (error) {
        console.error("Error adding food to menu:", error);
    }
};


export const removeFoodFromMenuThunk = (menuId, foodData) => async (dispatch) => {
    try {
        const response = await fetch(`/api/menus/${menuId}/remove_food`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({ food: foodIds }),
            body: JSON.stringify(foodData),
        });
        const data = await response.json();
        if (response.ok) {
            dispatch(removeFoodFromMenu(data));
        } else {
            throw new Error(data.error || "Failed to remove food");
        }
    } catch (error) {
        console.error("Error removing food from menu:", error);
    }
};

let initialState = {
    menus: {},
    menu: {},
    currentMenu: {},
    menuFoods: {}
}

export default function menuReducer(state = initialState, action) {
    let newState = { ...state }
    switch (action.type) {
        case GET_ALL_MENUS:
            for (const menu of action.payload.menus) {
                newState.menus[menu.id] = menu
            }
            return newState
        case GET_MENU:
            return {
                ...state,
                menu: action.payload
            };
        case GET_MENU_FOODS:
            return {
                ...state,
                menuFoods: action.payload
            }
        case GET_CURRENT_MENU:
            return {
                ...state,
                currentMenu: action.payload
            };
        case SET_CURRENT_MENU:
            return {
                ...state,
                currentMenu: action.payload
            };
        case CREATE_MENU:
            newState.menus[action.payload.menu.id] = action.payload.menu
            return newState
        case UPDATE_MENU:
            return {
                ...state,
                menu: action.payload
            };
        case DELETE_MENU:
            const newMenus = { ...state.menus };
            delete newMenus[action.payload.id];
            return {
                ...state,
                menus: newMenus,
                menu: {}
            };
        case ADD_FOOD_TO_MENU:
            return {
                ...state,
                currentMenu: action.payload
            }
        case REMOVE_FOOD_FROM_MENU:
            const updatedMenuFoods = action.payload;
            return {
                ...state,
                menuFoods: updatedMenuFoods,
                currentMenu: {
                    ...state.currentMenu,
                    foods: updatedMenuFoods
                }
            };
        default:
            return state
    }
}
