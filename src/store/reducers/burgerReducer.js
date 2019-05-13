import * as actionTypes from "../actionTypes/actionTypes";

const INGREDIENT_PRICE = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false
};

const burgerReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_INGREDIENT_BEGIN:
      return {
        ...state,
        error: false
      };
    case actionTypes.FETCH_INGREDIENT_SUCCESS:
      let fetchedIngredients = null;
      for (let key in action.ingredients) {
        fetchedIngredients = action.ingredients[key];
      }
      return {
        ...state,
        ingredients: fetchedIngredients,
        totalPrice: 4,
        error: false
      };
    case actionTypes.FETCH_INGREDIENT_FAILED:
      return {
        ...state,
        error: true,
        ingredients: null
      };
    case actionTypes.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]: state.ingredients[action.ingredientName] + 1
        },
        totalPrice: state.totalPrice + INGREDIENT_PRICE[action.ingredientName]
      };
    case actionTypes.REMOVE_INGREDIENT:
      return {
        ...state,
        ingredients: {
          ...state.ingredients,
          [action.ingredientName]: state.ingredients[action.ingredientName] - 1
        },
        totalPrice: state.totalPrice - INGREDIENT_PRICE[action.ingredientName]
      };
    default:
      return state;
  }
};

export default burgerReducer;
