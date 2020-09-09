import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../util';

const initialState = {
    companies: [

    ],
    deleteError: null,
    editError: null,
    deleting: false,
    editing: false,
    error: null,
    loading: false
};


const companiesLoadStart = state => {
    return updateObject(state, {
        ...initialState,
        companies: [
            ...state.companies
        ],
        loading: true
    });
};
const companiesLoadSuccess = (state, action) => {
    return updateObject(state, {
        companies: action.companies,
        error: null,
        loading: false
    });
};
const companiesLoadFail = (state, action) => {
    return updateObject(state, { companies: [], error: action.error, loading: false });
};


const companyDeleteStart = state => {
    return updateObject(state, {
        ...initialState,
        companies: [
            ...state.companies
        ],
        deleting: true
    });
};
const companyDeleteSuccess = (state, action) => {
    return updateObject(state, {
        ...initialState,
        companies: state.companies.filter(c => c.id !== action.id),
        deleting: false
    });
};
const companyDeleteFail = (state, action) => {
    return updateObject(state, {
        ...initialState,
        companies: [
            ...state.companies
        ],
        deleting: false,
        deleteError: action.error
    });
};


const companyEditStart = state => {
    return updateObject(state, {
        ...initialState,
        companies: [
            ...state.companies
        ],
        editing: true
    });
};
const companyEditSuccess = (state, action) => {
    return updateObject(state, {
        ...initialState,
        companies: state.companies.map(c => (c.id !== action.id) ? c : { ...c, ...action.companyData,  }),
        editing: false
    });
};
const companyEditFail = (state, action) => {
    return updateObject(state, {
        ...initialState,
        companies: [
            ...state.companies
        ],
        editing: false,
        editError: action.error
    });
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.COMPANIES_LOAD_START: return companiesLoadStart(state);
        case actionTypes.COMPANIES_LOAD_SUCCESS: return companiesLoadSuccess(state, action);
        case actionTypes.COMPANIES_LOAD_FAIL: return companiesLoadFail(state, action);

        case actionTypes.COMPANY_EDIT_START: return companyEditStart(state);
        case actionTypes.COMPANY_EDIT_SUCCESS: return companyEditSuccess(state, action);
        case actionTypes.COMPANY_EDIT_FAIL: return companyEditFail(state, action);

        case actionTypes.COMPANY_DELETE_START: return companyDeleteStart(state);
        case actionTypes.COMPANY_DELETE_SUCCESS: return companyDeleteSuccess(state, action);
        case actionTypes.COMPANY_DELETE_FAIL: return companyDeleteFail(state, action);

        default: return state;
    }
}

export default reducer;