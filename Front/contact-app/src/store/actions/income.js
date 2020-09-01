import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as userTypes from '../userTypes';

export const loadIncomeStart = () => {
    return {
        type: actionTypes.INCOME_LOAD_START
    };
};
export const loadIncomeSuccess = (income) => {
    console.log(income);
    return {
        type: actionTypes.INCOME_LOAD_SUCCESS,
        income: income
    };
};
export const loadIncomeFail = error => {
    console.log('[loadIncomeFail] error', error);
    return {
        type: actionTypes.INCOME_LOAD_FAIL,
        error: error
    };
};
export const loadIncome = () => {
    // console.log('load')
    // console.log('[Coupons action] params', params);
    return dispatch => {
        dispatch(loadIncomeStart());
        axios.get('/admin/income')
            .then(res => {
                // console.log('[Coupons action] response', res);
                if (res.data) {
                    if (!res.data.error)
                        dispatch(loadIncomeSuccess(res.data));
                    else dispatch(loadIncomeFail(res.data.error));
                }
                else
                    dispatch(loadIncomeFail());

            })
            .catch(err => {
                // console.log(err.response.data.error)
                // console.log(err.message);
                if (err.response && err.response.data && err.response.data.error)
                    dispatch(loadIncomeFail(err.response.data.error));
                else
                    dispatch(loadIncomeFail(err.message));
            });

    };
};