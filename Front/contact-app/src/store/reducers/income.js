import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../util';

const initialState = {
    income: [

    ],
    error: null,
    loading: false
};


const incomeLoadStart = state => {
    return updateObject(state, {
        ...initialState,
        income: [
            ...state.income
        ],
        loading: true
    });
};
const incomeLoadSuccess = (state, action) => {
    return updateObject(state, {
        income: action.income,
        error: null,
        loading: false
    });
};
const incomeLoadFail = (state, action) => {
    return updateObject(state, { income: [], error: action.error, loading: false });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INCOME_LOAD_START: return incomeLoadStart(state);
        case actionTypes.INCOME_LOAD_SUCCESS: return incomeLoadSuccess(state, action);
        case actionTypes.INCOME_LOAD_FAIL: return incomeLoadFail(state, action);

        default: return state;
    }
};

export default reducer;