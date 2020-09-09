import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as userTypes from '../userTypes';

export const couponClear = () => {
    return {
        type: actionTypes.COUPON_CLEAR
    };
};


export const loadCouponsStart = () => {
    return {
        type: actionTypes.COUPON_LOAD_START
    };
};
export const loadCouponsSuccess = (coupons, params) => {
    // console.log(coupons);
    return {
        type: actionTypes.COUPON_LOAD_SUCCESS,
        params: params,
        coupons: coupons
    };
};
export const loadCouponsFail = (error, params) => {
    // console.log('[loadCouponsFail] error', error);
    // console.log('[loadCouponsFail] params', params);
    return {
        type: actionTypes.COUPON_LOAD_FAIL,
        params: params,
        error: error
    };
};
export const loadCoupons = (params, isAll) => {
    // console.log('load')
    // console.log('[Coupons action] params', params);
    return dispatch => {
        dispatch(loadCouponsStart());
        axios.get('/coupons', {
            params: {
                ...params,
                searchIn: 'NEW'
            }
        })
            .then(res => {
                // console.log('[Coupons action] response', res);
                if (res.data) {
                    if (!res.data.error) {
                        dispatch(loadCouponsSuccess(res.data, params));
                        if (isAll)
                            dispatch(loadCouponsArchived(params));
                    }
                    else dispatch(loadCouponsFail(res.data.error, params));
                }
                else
                    dispatch(loadCouponsFail());

            })
            .catch(err => {
                // console.log(err.response.data.error)
                // console.log(err.message);
                if (err.response && err.response.data && err.response.data.error)
                    dispatch(loadCouponsFail(err.response.data.error, params));
                else
                    dispatch(loadCouponsFail(err.message, params));
            });

    };
};


export const loadCouponsArchivedStart = () => {
    return {
        type: actionTypes.COUPON_ARCHIVED_LOAD_START
    };
};
export const loadCouponsArchivedSuccess = (coupons, params) => {
    // console.log(coupons);
    return {
        type: actionTypes.COUPON_ARCHIVED_LOAD_SUCCESS,
        params: params,
        coupons: coupons
    };
};
export const loadCouponsArchivedFail = (error, params) => {
    return {
        type: actionTypes.COUPON_ARCHIVED_LOAD_FAIL,
        params: params,
        error: error
    };
};
export const loadCouponsArchived = (params) => {
    return dispatch => {
        dispatch(loadCouponsArchivedStart());
        axios.get('/coupons', {
            params: {
                ...params,
                searchIn: 'ARCHIVED'
            }
        })
            .then(res => {
                // console.log('[Coupons action] response', res);
                if (res.data) {
                    if (!res.data.error)
                        dispatch(loadCouponsArchivedSuccess(res.data, params));
                    else dispatch(loadCouponsArchivedFail(res.data.error, params));
                }
                else
                    dispatch(loadCouponsArchivedFail());

            })
            .catch(err => {
                // console.log(err.response.data.error)
                // console.log(err.message);
                if (err.response && err.response.data && err.response.data.error)
                    dispatch(loadCouponsArchivedFail(err.response.data.error, params));
                else
                    dispatch(loadCouponsArchivedFail(err.message, params));
            });

    };
};





export const editCouponStart = () => {
    return {
        type: actionTypes.COUPON_EDIT_START
    }
};
export const editCouponFail = error => {
    return {
        type: actionTypes.COUPON_EDIT_FAIL,
        error: error
    }
};
export const editCouponSuccess = (id, couponData) => {
    return {
        type: actionTypes.COUPON_EDIT_SUCCESS,
        couponData: couponData,
        id: id,
    }
};
export const editCoupon = (authData, coupon) => {
    return dispatch => {
        const id = coupon.id, couponData = { ...coupon };
        let uri;
        delete couponData['id'];
        if (!authData || !authData.type)
            dispatch(editCouponFail('Invalid auth data'));

        else {
            dispatch(editCouponStart());

            switch (authData.type) {
                case userTypes.ADMIN:
                    uri = '/coupons/' + id;
                    break;
                case userTypes.COMPANY:
                    uri = '/company/coupons/' + id;
                    break;
                default:
                    dispatch(editCouponFail('Invalid auth data'));
                    break;
            }
            axios.post(uri, couponData)
                .then(res => {
                    if (res.data) {
                        if (res.data.error) {
                            dispatch(editCouponFail(res.data.error));
                        }
                        setTimeout(() => dispatch(couponClear()), 15000);
                    }
                    else dispatch(editCouponSuccess(id, coupon));
                })
                .catch(err => {
                    if (err.response && err.response.data && err.response.data.error)
                        dispatch(editCouponFail(err.response.data.error));
                    else
                        dispatch(editCouponFail(err.message));
                    setTimeout(() => dispatch(couponClear()), 15000);
                })
        }
    };
};


export const deleteCouponStart = () => {
    return {
        type: actionTypes.COUPON_DELETE_START
    }
};
export const deleteCouponFail = error => {
    return {
        type: actionTypes.COUPON_DELETE_FAIL,
        error: error
    }
};
export const deleteCouponSuccess = id => {
    return {
        type: actionTypes.COUPON_DELETE_SUCCESS,
        id: id
    }
};
export const deleteCoupon = (authData, coupon) => {
    return dispatch => {
        const { id } = coupon;
        let uri;
        if (!authData || !authData.type)
            dispatch(deleteCouponFail('Invalid auth data'));

        else {
            dispatch(deleteCouponStart());

            switch (authData.type) {
                case userTypes.ADMIN:
                    uri = '/coupons/' + id;
                    break;
                case userTypes.COMPANY:
                    uri = '/company/coupons/' + id;
                    break;
                default:
                    dispatch(deleteCouponFail('Invalid auth data'));
                    break;
            }
            axios.delete(uri)
                .then(res => {
                    if (res.data) {
                        if (res.data.error) {
                            dispatch(deleteCouponFail(res.data.error));
                        }
                        setTimeout(() => dispatch(couponClear()), 15000);
                    }
                    else dispatch(deleteCouponSuccess(id, coupon));
                })
                .catch(err => {
                    if (err.response && err.response.data && err.response.data.error)
                        dispatch(deleteCouponFail(err.response.data.error));
                    else
                        dispatch(deleteCouponFail(err.message));
                    setTimeout(() => dispatch(couponClear()), 15000);
                })
        }
    };
};


export const createCouponStart = () => {
    return {
        type: actionTypes.COUPON_CREATE_START
    }
};
export const createCouponFail = error => {
    return {
        type: actionTypes.COUPON_CREATE_FAIL,
        error: error
    }
};
export const createCouponSuccess = id => {
    return {
        type: actionTypes.COUPON_CREATE_SUCCESS,
        id: id
    }
};
export const createCoupon = (authData, couponData) => {
    return dispatch => {
        let uri;
        if (!authData || !authData.type)
            dispatch(createCouponFail('Invalid auth data'));

        else {
            dispatch(createCouponStart());

            switch (authData.type) {
                case userTypes.ADMIN:
                    uri = '/coupons/';
                    break;
                case userTypes.COMPANY:
                    uri = '/company/coupons/';
                    break;
                default:
                    dispatch(createCouponFail('Invalid auth data'));
                    break;
            }
            // console.log('[coupons.js] createCoupon() { couponData } => ', couponData)
            axios.post(uri, couponData)
                .then(res => {
                    if (res.data) {
                        if (res.data.error) {
                            dispatch(createCouponFail(res.data.error));
                        }
                        setTimeout(() => dispatch(couponClear()), 20000);
                    }
                    else {
                        dispatch(createCouponSuccess());
                        dispatch(loadCoupons());
                        setTimeout(() => dispatch(couponClear()), 3000);
                    }
                })
                .catch(err => {
                    if (err.response && err.response.data && err.response.data.error)
                        dispatch(createCouponFail(err.response.data.error));
                    else
                        dispatch(createCouponFail(err.message));
                    setTimeout(() => dispatch(couponClear()), 20000);
                })
        }
    };
};

