import axios from 'axios';
import * as actionTypes from './actionTypes';

export const toggleCatagory = (catagory) => {
    return {
        type: actionTypes.CATAGORY_TOGGLE,
        catagory: catagory
    };
};

export const resetCatagory = () => {
    return {
        type: actionTypes.CATAGORY_RESET
    };
};

export const loadCatagoryStart = () => {
    return {
        type: actionTypes.CATAGORY_LOAD_START
    };
};

export const loadCatagorySuccess = (catagories) => {
    return {
        type: actionTypes.CATAGORY_LOAD_SUCCESS,
        catagories: catagories
    };
};

export const loadCatagoryFail = () => {
    return {
        type: actionTypes.CATAGORY_LOAD_FAIL
    };
};


export const loadCatagory = () => {
    return dispatch => {
        dispatch(loadCatagoryStart());
        axios.get('/coupons/getCouponTypes')
            .then(res => {
                if (res.data && res.data.types)
                    dispatch(loadCatagorySuccess(res.data.types));
                else
                    dispatch(loadCatagoryFail());

            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.error)
                    console.log(err.response.data.error);
                else
                    console.log(err.message);
                dispatch(loadCatagoryFail());
            });

    };
};