import * as actionTypes from '../actions/actionTypes';
import { updateObject, createCouponCatagoryObject } from '../util';

const initialState = {
    catagories: {
        Food: false,
        Camping: false,
        Gaming: false,
        Travelling: false,
        Biking: false
    },
    loading: false
};

const catagoryLoadStart = (state) => {
    return updateObject(state, { loading: true });
}

const catagoryLoadSuccess = (state, action) => {
    return updateObject(state, {
        catagories: createCouponCatagoryObject(action.catagories),
        loading: false
    });
};

const catagoryLoadFail = () => {
    return initialState;
}

const catagoryToggle = (state, action) => {
    if (action.catagory in state.catagories)
        return updateObject(state, {
            catagories: {
                ...state.catagories,
                [action.catagory]: !state.catagories[action.catagory]
            }
        });
    return state;
}

const catagoryReset = state => {
    const updatedCatagories = { ...state.catagories };
    Object.keys(updatedCatagories).forEach(key => updatedCatagories[key] = false);

    return updateObject(state, { catagories: updatedCatagories });
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CATAGORY_LOAD_START: return catagoryLoadStart(state);
        case actionTypes.CATAGORY_LOAD_SUCCESS: return catagoryLoadSuccess(state, action);
        case actionTypes.CATAGORY_LOAD_FAIL: return catagoryLoadFail();
        case actionTypes.CATAGORY_TOGGLE: return catagoryToggle(state, action);
        case actionTypes.CATAGORY_RESET: return catagoryReset(state);
        default: return state;
    }
};

export default reducer;