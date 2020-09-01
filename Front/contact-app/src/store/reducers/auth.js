import * as actionTypes from '../actions/actionTypes';
// import * as userTypes from '../userTypes';
import { updateObject, getUserType } from '../util';

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

const initialState = {
    user: null,
    error: null,
    loading: false,
    signedUp: null
};

const authStart = state => updateObject(state, { ...initialState, loading: true });

const authSuccess = (state, action) => {
    return updateObject(state, {
        ...initialState,
        user: updateObject(state.user, {
            type: getUserType(action.authData.type),
            id: action.authData.id,
            name: action.authData.name,
        }),
        persistExpiresAt: new Date().addHours(1)
    });
};

const authLogout = state => updateObject(state, ...initialState);

const authRefresh = (state, action) => {
    if (!state.user)
        return authLogout(state, action);
    return updateObject(state, {
        ...initialState,
        user: { ...state.user },
        persistExpiresAt: new Date().addHours(1)
    });
};
const authFail = (state, action) => {
    return updateObject(state, { ...initialState, error: action.error });
};

const authSignUp = state => updateObject(state, { ...initialState, signedUp: 'Successfuly signed up!' });
const authClear = state => updateObject(state, { ...initialState });

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state);
        case actionTypes.AUTH_REFRESH: return authRefresh(state, action);
        case actionTypes.AUTH_SIGNUP: return authSignUp(state);
        case actionTypes.AUTH_CLEAR: return authClear(state);
        default: return state;
    }
};

export default reducer;