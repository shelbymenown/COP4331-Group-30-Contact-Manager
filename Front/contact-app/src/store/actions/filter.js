import * as actionTypes from './actionTypes';

export const selectFilter = (filter) => {
    return {
        type: actionTypes.FILTER_SELECT,
        filter: filter
    };
};