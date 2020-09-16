import * as actionTypes from './actions';

const initialState = {
    ingredients: {
        salad: 0,
        bacon: 0,
        cheese: 0,
        meat: 0
    },
    totalPrice: 0
}

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 1.7
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT:
            const newPrice = (parseFloat(state.totalPrice) + INGREDIENT_PRICES[action.ingredientName]).toFixed(2);
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] + 1
                },
                totalPrice: newPrice
            }
        case actionTypes.REMOVE_INGREDIENT:
            if (state.ingredients[action.ingredientName] > 0) {
                const newPrice = (parseFloat(state.totalPrice) - INGREDIENT_PRICES[action.ingredientName]).toFixed(2);
                return {
                    ...state,
                    ingredients: {
                        ...state.ingredients,
                        [action.ingredientName]: state.ingredients[action.ingredientName] - 1
                    },
                    totalPrice: newPrice
                }
            }
            return state;
        default:
            return state;
    }
}

export default reducer;