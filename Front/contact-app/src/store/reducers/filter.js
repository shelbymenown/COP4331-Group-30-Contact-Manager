import * as actionTypes from '../actions/actionTypes';

const initialState = {
    all: false,
    archived: false,
    new: true
};

const selectFilter = (state, action) => {
    if (action.filter in state) {
        const updatedState = { ...state }
        Object.keys(updatedState).forEach(key => updatedState[key] = key === action.filter ? true : false);
        return updatedState;
    }
    return state;
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FILTER_SELECT: return selectFilter(state, action);
        default: return state;
    }
};

export default reducer;