import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as actions from './actions';


export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const signUpSuccess = () => {
    return {
        type: actionTypes.AUTH_SIGNUP
    };
};

export const authClear = () => {
    return {
        type: actionTypes.AUTH_CLEAR
    };
};

export const authSuccess = (authData) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData: authData
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logoutStart = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const logoutSuccess = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};


export const logoutFailure = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

// Every action should dispatch authRefresh()
// Every action should dispatch authLogout() if user is invalidated
export const authRefresh = () => {
    return {
        type: actionTypes.AUTH_REFRESH
    };
};

// Authentication timeout:
// export const checkAuthTimeout = (expirationTime) => {
//     return dispatch => {
//         setTimeout(() => {
//             dispatch(logout());
//         }, expirationTime * 1000);
//     };
// };

export const signUp = (userData, isCompany) => {
    return dispatch => {
        dispatch(authStart());
        console.log(userData);
        axios.post(isCompany ? '/company' : '/customer', userData)
            .then(res => {
                console.log(res.data);
                dispatch(signUpSuccess());
                console.log('signedUP!!')
                setTimeout(() => dispatch(authClear()), 1500);
            })
            .catch(err => {
                console.log(err);
                if (err.response && err.response.data && err.response.data.error) {
                    dispatch(authFail(err.response.data.error));
                    console.log(err.response);
                }
                else
                    dispatch(authFail(err.message));
            });
    }
}

// export const logout = () => {
//     axios.post('auth/logout')
//         .then(() => {
//             console.log("[auth.js] POST @ ../auth/logout @ Success");
//         })
//         .catch(err => {
//             if (err.response && err.response.data && err.response.data.error)
//                 console.log("[auth.js] POST @ ../auth/logout @ Error", err.response.data.error);
//             else
//                 console.log("[auth.js] POST @ ../auth/logout @ Error", err.message);
//         });
//     return {
//         type: actionTypes.AUTH_LOGOUT
//     };
// };

export const logout = () => {
    return dispatch => {
        axios.post('auth/logout')
            .then(() => {
                console.log("[auth.js] POST @ ../auth/logout @ Success");
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.error)
                    console.log("[auth.js] POST @ ../auth/logout @ Error", err.response.data.error);
                else
                    console.log("[auth.js] POST @ ../auth/logout @ Error", err.message);
            });
        dispatch(logoutSuccess());
        dispatch(actions.unloadCart());
    }
};

export const auth = (username, password, isCompany) => {
    return dispatch => {
        dispatch(authStart());
        axios.post('auth/login', {
            username: username,
            password: password,
            company: isCompany
        })
            .then(res => {
                console.log(res.data);
                dispatch(authSuccess(res.data));
                dispatch(actions.loadCart(res.data));
                // dispatch(actions.cartLoad(res.data))
                // Set authentication timeout:
                // dispatch(checkAuthTimeout(res.data.expiresIn));
            })
            .catch(err => {
                // console.log(err);
                // console.log(err.message);
                // console.log(err.response);
                // console.log(Object.getOwnPropertyNames(err));
                if (err.response && err.response.data && err.response.data.error)
                    dispatch(authFail(err.response.data.error));
                else
                    dispatch(authFail(err.message));
            });
    };
};