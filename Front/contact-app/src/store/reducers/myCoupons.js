import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../util';

const initialState = {
    coupons: [

    ],
    error: null,
    deleteError: null,
    editError: null,
    loading: false,
    deleting: false,
    editing: false
};

const couponClear = state => {
    return updateObject(state, {
        ...initialState,
        coupons: [...state.coupons]
    });
};


const couponDeleteStart = state => {
    return updateObject(state, {
        ...initialState,
        coupons: [
            ...state.coupons
        ],
        deleting: true
    });
};
const couponDeleteSuccess = (state, action) => {
    return updateObject(state, {
        ...initialState,
        coupons: state.coupons.filter(c => c.id !== action.id),
        deleting: false
    });
};
const couponDeleteFail = (state, action) => {
    return updateObject(state, {
        ...initialState,
        coupons: [
            ...state.coupons
        ],
        deleting: false,
        deleteError: action.error
    });
};


const couponEditStart = state => {
    return updateObject(state, {
        ...initialState,
        coupons: [
            ...state.coupons
        ],
        editing: true
    });
};
const couponEditSuccess = (state, action) => {
    return updateObject(state, {
        ...initialState,
        coupons: state.coupons.map(c => (c.id !== action.id) ? c : { id: action.id, ...action.couponData }),
        editing: false
    });
};
const couponEditFail = (state, action) => {
    return updateObject(state, {
        ...initialState,
        coupons: [
            ...state.coupons
        ],
        editing: false,
        editError: action.error
    });
};


const myCouponsLoadStart = state => {
    return updateObject(state, {
        ...initialState,
        coupons: [
            ...state.coupons
        ],
        loading: true
    });
};
const myCouponsLoadSuccess = (state, action) => {
    return updateObject(state, {
        coupons: action.coupons,
        params: action.params,
        error: null,
        loading: false
    });
};
const myCouponsLoadFail = (state, action) => {
    return updateObject(state, { coupons: [], params: action.params, error: action.error, loading: false });
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.MY_COUPON_CLEAR: return couponClear(state);

        case actionTypes.MY_COUPON_LOAD_START: return myCouponsLoadStart(state);
        case actionTypes.MY_COUPON_LOAD_SUCCESS: return myCouponsLoadSuccess(state, action);
        case actionTypes.MY_COUPON_LOAD_FAIL: return myCouponsLoadFail(state, action);

        case actionTypes.MY_COUPON_EDIT_START: return couponEditStart(state);
        case actionTypes.MY_COUPON_EDIT_SUCCESS: return couponEditSuccess(state, action);
        case actionTypes.MY_COUPON_EDIT_FAIL: return couponEditFail(state, action);

        case actionTypes.MY_COUPON_DELETE_START: return couponDeleteStart(state);
        case actionTypes.MY_COUPON_DELETE_SUCCESS: return couponDeleteSuccess(state, action);
        case actionTypes.MY_COUPON_DELETE_FAIL: return couponDeleteFail(state, action);

        default: return state;
    }
}

export default reducer;