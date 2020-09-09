import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as userTypes from '../userTypes';

export const companyClear = () => {
    return {
        type: actionTypes.COMPANIES_CLEAR
    };
};


export const loadCompaniesStart = () => {
    return {
        type: actionTypes.COMPANIES_LOAD_START
    };
};
export const loadCompaniesSuccess = (companies) => {
    console.log(companies);
    return {
        type: actionTypes.COMPANIES_LOAD_SUCCESS,
        companies: companies
    };
};
export const loadCompaniesFail = error => {
    console.log('[loadCompaniesFail] error', error);
    return {
        type: actionTypes.COMPANIES_LOAD_FAIL,
        error: error
    };
};
export const loadCompanies = () => {
    // console.log('load')
    // console.log('[Coupons action] params', params);
    return dispatch => {
        dispatch(loadCompaniesStart());
        axios.get('/company/all')
            .then(res => {
                // console.log('[Coupons action] response', res);
                if (res.data) {
                    if (!res.data.error)
                        dispatch(loadCompaniesSuccess(res.data));
                    else dispatch(loadCompaniesFail(res.data.error));
                }
                else
                    dispatch(loadCompaniesFail());

            })
            .catch(err => {
                // console.log(err.response.data.error)
                // console.log(err.message);
                if (err.response && err.response.data && err.response.data.error)
                    dispatch(loadCompaniesFail(err.response.data.error));
                else
                    dispatch(loadCompaniesFail(err.message));
            });

    };
};


export const editCompanyStart = () => {
    return {
        type: actionTypes.COMPANY_EDIT_START
    }
};
export const editCompanyFail = error => {
    return {
        type: actionTypes.COMPANY_EDIT_FAIL,
        error: error
    }
};
export const editCompanySuccess = (id, companyData) => {
    return {
        type: actionTypes.COMPANY_EDIT_SUCCESS,
        companyData: companyData,
        id: id,
    }
};
export const editCompany = (authData, company) => {
    return dispatch => {
        const id = company.id, companyData = { ...company };
        delete companyData['id'];
        delete companyData['coupons'];
        console.log(company);
        if (!authData || !authData.type)
            dispatch(editCompanyFail('Invalid auth data'));

        else {
            dispatch(editCompanyStart());

            switch (authData.type) {
                case userTypes.ADMIN:
                    axios.post('/company/' + id, companyData)
                        .then(res => {
                            if (res.data) {
                                if (res.data.error) {
                                    dispatch(editCompanyFail(res.data.error));
                                }
                                setTimeout(() => dispatch(companyClear()), 15000);
                            }
                            else dispatch(editCompanySuccess(id, companyData));
                        })
                        .catch(err => {
                            if (err.response && err.response.data && err.response.data.error)
                                dispatch(editCompanyFail(err.response.data.error));
                            else
                                dispatch(editCompanyFail(err.message));
                            setTimeout(() => dispatch(companyClear()), 15000);
                        })
                    break;
                case userTypes.COMPANY:
                    console.log('reeee');
                    axios.post('/company/update/', companyData)
                        .then(res => {
                            if (res.data) {
                                if (res.data.error) {
                                    dispatch(editCompanyFail(res.data.error));
                                    console.log('here');
                                }
                                setTimeout(() => dispatch(companyClear()), 15000);
                            }
                            else dispatch(editCompanySuccess(id, company));
                        })
                        .catch(err => {
                            console.log('here', err);
                            if (err.response && err.response.data && err.response.data.error)
                                dispatch(editCompanyFail(err.response.data.error));
                            else
                                dispatch(editCompanyFail(err.message));
                            console.log('here', err);
                            setTimeout(() => dispatch(companyClear()), 15000);
                        })
                    break;
                default:
                    dispatch(editCompanyFail('Invalid auth data'));
                    break;
            }
        }
    };
};


export const deleteCompanyStart = () => {
    return {
        type: actionTypes.COMPANY_DELETE_START
    }
};
export const deleteCompanyFail = error => {
    return {
        type: actionTypes.COMPANY_DELETE_FAIL,
        error: error
    }
};
export const deleteCompanySuccess = id => {
    return {
        type: actionTypes.COMPANY_DELETE_SUCCESS,
        id: id
    }
};
export const deleteCompany = (authData, company) => {
    return dispatch => {
        const { id } = company;
        let uri;
        if (!authData || authData.type !== userTypes.ADMIN)
            dispatch(deleteCompanyFail('Invalid auth data'));

        else {
            dispatch(deleteCompanyStart());

            axios.delete('/company/' + id)
                .then(res => {
                    if (res.data) {
                        if (res.data.error) {
                            dispatch(deleteCompanyFail(res.data.error));
                        }
                        setTimeout(() => dispatch(companyClear()), 15000);
                    }
                    else dispatch(deleteCompanySuccess(id, company));
                })
                .catch(err => {
                    if (err.response && err.response.data && err.response.data.error)
                        dispatch(deleteCompanyFail(err.response.data.error));
                    else
                        dispatch(deleteCompanyFail(err.message));
                    setTimeout(() => dispatch(companyClear()), 15000);
                })
        }
    };
};


