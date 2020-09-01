import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../util';

const initialState = {
    coupons: [

    ],
    archivedCoupons: [

    ],
    params: null,
    error: null,
    archivedError: null,
    createSuccess: false,
    createError: null,
    deleteError: null,
    editError: null,
    creating: false,
    deleting: false,
    editing: false,
    loading: false,
    archivedLoading: false
};

const couponClear = state => {
    return updateObject(state, {
        ...initialState,
        coupons: [...state.coupons],
        archivedCoupons: [...state.archivedCoupons]
    });
};


const couponCreateStart = state => {
    return updateObject(state, {
        ...initialState,
        coupons: [
            ...state.coupons
        ],
        archivedCoupons: [
            ...state.archivedCoupons
        ],
        creating: true
    });
};
const couponCreateSuccess = state => {
    return updateObject(state, {
        ...initialState,
        coupons: [
            ...state.coupons
        ],
        archivedCoupons: [
            ...state.archivedCoupons
        ],
        createSuccess: true,
        creating: false
    });
};
const couponCreateFail = (state, action) => {
    return updateObject(state, {
        ...initialState,
        coupons: [
            ...state.coupons
        ],
        archivedCoupons: [
            ...state.archivedCoupons
        ],
        createError: action.error
    });
};


const couponDeleteStart = state => {
    return updateObject(state, {
        ...initialState,
        coupons: [
            ...state.coupons
        ],
        archivedCoupons: [
            ...state.archivedCoupons
        ],
        deleting: true
    });
};
const couponDeleteSuccess = (state, action) => {
    let newCoupons = [], removed = null;

    state.coupons.forEach(c => c.id !== action.id ? newCoupons.push(c) : removed = c);

    return updateObject(state, {
        ...initialState,
        // coupons: state.coupons.filter(c => c.id !== action.id),
        coupons: newCoupons,
        archivedCoupons: [
            removed,
            ...state.archivedCoupons
        ],
        deleting: false
    });
};
const couponDeleteFail = (state, action) => {
    return updateObject(state, {
        ...initialState,
        coupons: [
            ...state.coupons
        ],
        archivedCoupons: [
            ...state.archivedCoupons
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
        archivedCoupons: [
            ...state.archivedCoupons
        ],
        editing: true
    });
};
const couponEditSuccess = (state, action) => {
    return updateObject(state, {
        ...initialState,
        coupons: state.coupons.map(c => (c.id !== action.id) ? c : { id: action.id, ...action.couponData }),
        archivedCoupons: [
            ...state.archivedCoupons
        ],
        editing: false
    });
};
const couponEditFail = (state, action) => {
    return updateObject(state, {
        ...initialState,
        coupons: [
            ...state.coupons
        ],
        archivedCoupons: [
            ...state.archivedCoupons
        ],
        editing: false,
        editError: action.error
    });
};


const couponsLoadStart = state => {
    return updateObject(state, {
        ...initialState,
        coupons: [
            ...state.coupons
        ],
        archivedCoupons: [
            ...state.archivedCoupons
        ],
        loading: true
    });
};
const couponsLoadSuccess = (state, action) => {
    return updateObject(state, {
        archivedCoupons: [
            ...state.archivedCoupons
        ],
        coupons: action.coupons,
        params: action.params,
        error: null,
        loading: false
    });
};
const couponsLoadFail = (state, action) => {
    return updateObject(state, { coupons: [], archivedCoupons: [...state.archivedCoupons], params: action.params, error: action.error, loading: false });
};


const couponsArchivedLoadStart = state => {
    return updateObject(state, {
        ...initialState,
        coupons: [
            ...state.coupons
        ],
        archivedCoupons: [
            ...state.archivedCoupons
        ],
        createSuccess: state.createSuccess,
        archivedLoading: true
    });
};
const couponsArchivedLoadSuccess = (state, action) => {
    return updateObject(state, {
        coupons: [
            ...state.coupons
        ],
        archivedCoupons: action.coupons,
        params: action.params,
        archivedError: null,
        archivedLoading: false
    });
};
const couponsArchivedLoadFail = (state, action) => {
    return updateObject(state, {
        coupons: [
            ...state.coupons
        ],
        archivedCoupons: [],
        params: action.params,
        archivedError: action.error,
        archivedLoading: false
    });
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.COUPON_CLEAR: return couponClear(state);

        case actionTypes.COUPON_LOAD_START: return couponsLoadStart(state);
        case actionTypes.COUPON_LOAD_SUCCESS: return couponsLoadSuccess(state, action);
        case actionTypes.COUPON_LOAD_FAIL: return couponsLoadFail(state, action);

        case actionTypes.COUPON_ARCHIVED_LOAD_START: return couponsArchivedLoadStart(state);
        case actionTypes.COUPON_ARCHIVED_LOAD_SUCCESS: return couponsArchivedLoadSuccess(state, action);
        case actionTypes.COUPON_ARCHIVED_LOAD_FAIL: return couponsArchivedLoadFail(state, action);

        case actionTypes.COUPON_EDIT_START: return couponEditStart(state);
        case actionTypes.COUPON_EDIT_SUCCESS: return couponEditSuccess(state, action);
        case actionTypes.COUPON_EDIT_FAIL: return couponEditFail(state, action);

        case actionTypes.COUPON_DELETE_START: return couponDeleteStart(state);
        case actionTypes.COUPON_DELETE_SUCCESS: return couponDeleteSuccess(state, action);
        case actionTypes.COUPON_DELETE_FAIL: return couponDeleteFail(state, action);

        case actionTypes.COUPON_CREATE_START: return couponCreateStart(state);
        case actionTypes.COUPON_CREATE_SUCCESS: return couponCreateSuccess(state);
        case actionTypes.COUPON_CREATE_FAIL: return couponCreateFail(state, action);

        default: return state;
    }
}

export default reducer;