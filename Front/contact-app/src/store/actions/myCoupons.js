import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as userTypes from '../userTypes';

export const myCouponClear = () => {
    return {
        type: actionTypes.MY_COUPON_CLEAR
    }
}

export const loadMyCouponsStart = () => {
    return {
        type: actionTypes.MY_COUPON_LOAD_START
    };
};
export const loadMyCouponsSuccess = (coupons) => {
    console.log(coupons);
    return {
        type: actionTypes.MY_COUPON_LOAD_SUCCESS,
        coupons: coupons
    };
};
export const loadMyCouponsFail = (error) => {
    return {
        type: actionTypes.MY_COUPON_LOAD_FAIL,
        error: error
    };
};
export const loadMyCoupons = (authData, params) => {
    console.log('load')
    console.log('[myCoupons Action] authData', authData);
    return dispatch => {
        if (!authData || !authData.type || authData.type === userTypes.ADMIN)
            dispatch(loadMyCouponsFail('Invalid auth data'));

        else {
            let uri;
            switch (authData.type) {
                case userTypes.CUSTOMER: uri = '/customer/coupons'; break;
                case userTypes.COMPANY: uri = '/company/coupons'; break;
                default: uri = null;
            }
            if (uri) {
                dispatch(loadMyCouponsStart());
                axios.get(uri, params)
                    .then(res => {
                        console.log("get request");
                        console.log(res);
                        if (res.data) {
                            if (!res.data.error)
                                dispatch(loadMyCouponsSuccess(res.data));
                            else dispatch(loadMyCouponsFail(res.data.error));
                        }
                        else
                            dispatch(loadMyCouponsFail());

                    })
                    .catch(err => {
                        console.log("error");
                        console.log(err.response.data.error)
                        if (err.response && err.response.data && err.response.data.error)
                            dispatch(loadMyCouponsFail((err.response.data.error)));
                        else
                            dispatch(loadMyCouponsFail((err.message)));
                    });
            }
        }
    };
};



export const editMyCouponStart = () => {
    return {
        type: actionTypes.MY_COUPON_EDIT_START
    }
};
export const editMyCouponFail = error => {
    return {
        type: actionTypes.MY_COUPON_EDIT_FAIL,
        error: error
    }
};
export const editMyCouponSuccess = (id, couponData) => {
    return {
        type: actionTypes.MY_COUPON_EDIT_SUCCESS,
        couponData: couponData,
        id: id,
    }
};
export const editMyCoupon = (authData, coupon) => {
    return dispatch => {
        const id = coupon.id, couponData = { ...coupon };
        let uri;
        delete couponData['id'];
        if (!authData || !authData.type)
            dispatch(editMyCouponFail('Invalid auth data'));

        else {
            dispatch(editMyCouponStart());

            axios.post('/company/coupons/' + id, couponData)
                .then(res => {
                    if (res.data) {
                        if (res.data.error) {
                            dispatch(editMyCouponFail(res.data.error));
                        }
                        setTimeout(() => dispatch(myCouponClear()), 15000);
                    }
                    else dispatch(editMyCouponSuccess(id, coupon));
                })
                .catch(err => {
                    if (err.response && err.response.data && err.response.data.error)
                        dispatch(editMyCouponFail(err.response.data.error));
                    else
                        dispatch(editMyCouponFail(err.message));
                    setTimeout(() => dispatch(myCouponClear()), 15000);
                })
        }
    };
};


export const deleteMyCouponStart = () => {
    return {
        type: actionTypes.MY_COUPON_DELETE_START
    }
};
export const deleteMyCouponFail = error => {
    return {
        type: actionTypes.MY_COUPON_DELETE_FAIL,
        error: error
    }
};
export const deleteMyCouponSuccess = id => {
    return {
        type: actionTypes.MY_COUPON_DELETE_SUCCESS,
        id: id
    }
};
export const deleteMyCoupon = (authData, coupon) => {
    return dispatch => {
        const { id } = coupon;
        let uri;
        if (!authData || !authData.type)
            dispatch(deleteMyCouponFail('Invalid auth data'));

        else {
            dispatch(deleteMyCouponStart());

            axios.delete('/company/coupons/' + id)
                .then(res => {
                    if (res.data) {
                        if (res.data.error) {
                            dispatch(deleteMyCouponFail(res.data.error));
                        }
                        setTimeout(() => dispatch(myCouponClear()), 15000);
                    }
                    else dispatch(deleteMyCouponSuccess(id, coupon));
                })
                .catch(err => {
                    if (err.response && err.response.data && err.response.data.error)
                        dispatch(deleteMyCouponFail(err.response.data.error));
                    else
                        dispatch(deleteMyCouponFail(err.message));
                    setTimeout(() => dispatch(myCouponClear()), 15000);
                })
        }
    };
};