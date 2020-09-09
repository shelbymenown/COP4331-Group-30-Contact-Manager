import * as actionTypes from '../actions/actionTypes';
import { updateObject, getUpdatedCart } from '../util';

const initialState = {
    cart: {

    },
    purchasedAll: true,
    purchasing: false,
    purchased: false,
    error: null,
    loading: false,
    items: 0
};

const initialItemState = {
    loading: false,
    purchased: false,
    error: null
}

const cartClear = state => {
    const updatedCart = getUpdatedCart(state.cart, initialItemState);

    return updateObject(state, {
        ...initialState,
        cart: updatedCart.cart,
        items: updatedCart.items
    });
};
const cartUnload = () => ({ ...initialState });


const cartLoadStart = state => {
    const updatedCart = getUpdatedCart(state.cart);

    return updateObject(state, {
        ...initialState,
        cart: updatedCart.cart,
        items: updatedCart.items,
        loading: true
    });
};
const cartLoadSuccess = (state, action) => {
    const updatedCart = getUpdatedCart(action.cart, initialItemState);

    return updateObject(state, {
        cart: updatedCart.cart,
        items: updatedCart.items,
        error: null,
        loading: false
    });
};
const cartLoadFail = (state, action) => {
    const updatedCart = getUpdatedCart(state.cart);

    return updateObject(state, {
        ...initialState,
        cart: updatedCart.cart,
        items: updatedCart.items,
        error: action.error
    });
};


const cartEmptyStart = state => {
    const updatedCart = getUpdatedCart(state.cart);

    return updateObject(state, {
        ...initialState,
        cart: updatedCart.cart,
        items: updatedCart.items,
        loading: true
    });
};
const cartEmptySuccess = () => ({ ...initialState });
const cartEmptyFail = (state, action) => {
    const updatedCart = getUpdatedCart(state.cart);

    return updateObject(state, {
        ...initialState,
        cart: updatedCart.cart,
        items: updatedCart.items,
        error: action.error,
    });
};





const removeItemStart = (state, action) => {
    const updatedCart = getUpdatedCart(state.cart);

    return updateObject(state, {
        ...initialState,
        cart: !action.itemId in updatedCart.cart ? updatedCart.cart : {
            ...updatedCart.cart,
            [action.itemId]: { ...initialItemState, loading: true, purchased: updatedCart.cart[action.itemId].purchased }
        },
        items: updatedCart.items
    });
};
const removeItemSuccess = (state, action) => {
    const updatedCart = {};
    for (let key in state.cart) {
        if (key != action.itemId)
            updatedCart[key] = { ...state.cart[key] };
        else
            updatedCart[key] = { ...state.cart[key], removed: true };
    }

    return updateObject(state, {
        ...initialState,
        cart: updatedCart,
        items: Object.keys(updatedCart).length
    });
};
const removeItemSuccessFinal = (state, action) => {
    const updatedCart = {};
    let count = 0;
    for (let key in state.cart) {
        if (key != action.itemId) {
            updatedCart[key] = { ...state.cart[key] };
            count++;
        }
    }
    console.log('removeItemSuccessFinal() updatedCart', updatedCart);

    return updateObject(state, {
        ...initialState,
        cart: updatedCart,
        items: count
    });
};
const removeItemFail = (state, action) => {
    const updatedCart = getUpdatedCart(state.cart);

    return updateObject(state, {
        ...initialState,
        cart: !action.itemId in updatedCart.cart ? updatedCart.cart : {
            ...updatedCart.cart,
            [action.itemId]: { ...initialItemState, error: action.error }
        },
        items: updatedCart.items
    });
};




const purchaseItemStart = (state, action) => {
    const updatedCart = getUpdatedCart(state.cart);

    return updateObject(state, {
        ...initialState,
        cart: !action.itemId in updatedCart.cart ? updatedCart.cart : {
            ...updatedCart.cart,
            [action.itemId]: { ...initialItemState, loading: true }
        },
        purchasedAll: state.purchasedAll,
        items: updatedCart.items,
        purchasing: state.purchasing
    });
};
const purchaseItemSuccess = (state, action) => {
    const updatedCart = getUpdatedCart(state.cart);
    
    return updateObject(state, {
        ...initialState,
        cart: !action.itemId in updatedCart.cart ? updatedCart.cart : {
            ...updatedCart.cart,
            [action.itemId]: { ...initialItemState, purchased: true }
        },
        purchasedAll: state.purchasedAll,
        items: updatedCart.items,
        purchasing: state.purchasing
    });
};
const purchaseItemFail = (state, action) => {
    const updatedCart = getUpdatedCart(state.cart);

    return updateObject(state, {
        ...initialState,
        cart: !action.itemId in updatedCart.cart ? updatedCart.cart : {
            ...updatedCart.cart,
            [action.itemId]: { ...initialItemState, error: action.error }
        },
        purchasedAll: false,
        items: updatedCart.items,
        purchasing: state.purchasing
    });
};



const addItemStart = (state) => {
    const updatedCart = getUpdatedCart(state.cart);

    return updateObject(state, {
        ...initialState,
        cart: updatedCart.cart,
        items: updatedCart.items,
        loading: true
    });
};
const addItemSuccess = (state, action) => {
    const updatedCart = getUpdatedCart(state.cart);
    updatedCart.cart[action.itemId] = { ...initialItemState };

    return updateObject(state, {
        ...initialState,
        cart: updatedCart.cart,
        items: Object.keys(updatedCart.cart).length,
        loading: false
    });
};
const addItemFail = (state, action) => {
    const updatedCart = getUpdatedCart(state.cart);

    return updateObject(state, {
        ...initialState,
        cart: updatedCart.cart,
        items: updatedCart.items,
        error: action.error,
        loading: false
    });
};








const purchaseCartStart = (state) => {
    console.log('[cart.js Reducer] purchaseCartStart() { state } =>', state);
    
    const updatedCart = {};
    for (let key in state.cart)
        updatedCart[key] = { ...initialItemState, loading: true };

    return updateObject(state, {
        ...initialState,
        cart: updatedCart,
        items: Object.keys(updatedCart).length,
        purchasing: true
    });
};
const purchaseCartSuccess = (state) => {
    const updatedCart = {};
    for (let key in state.cart)
        updatedCart[key] = { ...state.cart[key] };

    return updateObject(state, {
        ...initialState,
        cart: updatedCart,
        items: Object.keys(updatedCart).length,
        purchasedAll: state.purchasedAll,
        purchasing: false,
        purchased: true
    });
};
const purchaseCartFail = (state, action) => {
    const updatedCart = {};
    for (let key in state.cart)
        updatedCart[key] = { ...state.cart[key] };

    return updateObject(state, {
        ...initialState,
        cart: updatedCart,
        error: action.error,
        purchasing: false
    });
};




const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CART_CLEAR: return cartClear(state);
        case actionTypes.CART_UNLOAD: return cartUnload();

        case actionTypes.CART_LOAD_START: return cartLoadStart(state);
        case actionTypes.CART_LOAD_SUCCESS: return cartLoadSuccess(state, action);
        case actionTypes.CART_LOAD_FAIL: return cartLoadFail(state, action);

        case actionTypes.CART_EMPTY_START: return cartEmptyStart(state);
        case actionTypes.CART_EMPTY_SUCCESS: return cartEmptySuccess();
        case actionTypes.CART_EMPTY_FAIL: return cartEmptyFail(state, action);

        case actionTypes.CART_REMOVE_ITEM_START: return removeItemStart(state, action); removeItemSuccessFinal
        case actionTypes.CART_REMOVE_ITEM_SUCCESS: return removeItemSuccess(state, action);
        case actionTypes.CART_REMOVE_ITEM_SUCCESS_FINAL: return removeItemSuccessFinal(state, action);
        case actionTypes.CART_REMOVE_ITEM_FAIL: return removeItemFail(state, action);

        case actionTypes.CART_PURCHASE_ITEM_START: return purchaseItemStart(state, action);
        case actionTypes.CART_PURCHASE_ITEM_SUCCESS: return purchaseItemSuccess(state, action);
        case actionTypes.CART_PURCHASE_ITEM_FAIL: return purchaseItemFail(state, action);

        case actionTypes.CART_ADD_ITEM_START: return addItemStart(state, action);
        case actionTypes.CART_ADD_ITEM_SUCCESS: return addItemSuccess(state, action);
        case actionTypes.CART_ADD_ITEM_FAIL: return addItemFail(state, action);

        case actionTypes.CART_PURCHASE_START: return purchaseCartStart(state);
        case actionTypes.CART_PURCHASE_SUCCESS: return purchaseCartSuccess(state);
        case actionTypes.CART_PURCHASE_FAIL: return purchaseCartFail(state, action);

        default: return state;
    }
}

export default reducer;