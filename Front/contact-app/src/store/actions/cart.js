import axiosCart from '../../axios-cart';
import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as userTypes from '../userTypes';
import * as utils from '../util';

let queue = [], isRunning = false;

const execNext = () => {
    console.log('queue', queue);
    if (queue.length > 0)
        (queue.shift())();

    console.log('queue', queue);
    isRunning = queue.length > 0;
};


export const unloadCart = () => {
    console.log('[cart.js] unloadCart() ->...');
    return {
        type: actionTypes.CART_UNLOAD
    };
};


export const loadCartStart = () => {
    return {
        type: actionTypes.CART_LOAD_START
    };
};
export const loadCartSuccess = (cartData) => {
    return {
        type: actionTypes.CART_LOAD_SUCCESS,
        cart: utils.getCartFromJson(cartData)
    };
};
export const loadCartFail = (error) => {
    return {
        type: actionTypes.CART_LOAD_FAIL,
        error: error
    };
};
export const loadCart = (authData) => {
    // console.log('[cart.js] loadCart(authData) { authData } => ', authData);
    return dispatch => {
        if (!authData || !authData.type || authData.type !== userTypes.CUSTOMER || !authData.id)
            dispatch(loadCartFail('Invalid auth data'));

        else {
            dispatch(loadCartStart());
            axiosCart.get('u' + authData.id + '.json')
                .then(res => {
                    dispatch(loadCartSuccess(res.data));
                })
                .catch(err => {
                    if (err.response && err.response.data && err.response.data.error)
                        dispatch(loadCartFail((err.response.data.error)));
                    else if (err.message.toLowerCase().includes('Cannot convert undefined or null to object'.toLowerCase()))
                        dispatch(loadCartSuccess(null));
                    else
                        dispatch(loadCartFail((err.message)));
                });

        }
    };
};


export const emptyCartStart = () => {
    return {
        type: actionTypes.CART_EMPTY_START
    };
};
export const emptyCartSuccess = () => {
    return {
        type: actionTypes.CART_EMPTY_SUCCESS
    };
};
export const emptyCartFail = (error) => {
    return {
        type: actionTypes.CART_EMPTY_FAIL,
        error: error
    };
};
export const emptyCart = (authData) => {
    return dispatch => {
        if (!authData || !authData.type || authData.type !== userTypes.CUSTOMER || !authData.id)
            dispatch(emptyCartFail('Invalid auth data'));

        else {
            dispatch(emptyCartStart());
            axiosCart.delete('u' + authData.id + '.json')
                .then(res => {
                    console.log(res);
                    dispatch(emptyCartSuccess());
                })
                .catch(err => {
                    console.log("error");
                    // console.log(err.response.data.error)
                    if (err.response && err.response.data && err.response.data.error)
                        dispatch(emptyCartFail((err.response.data.error)));
                    else
                        dispatch(emptyCartFail((err.message)));
                });

        }
    };
};






export const removeItemStart = (itemId) => {
    return {
        type: actionTypes.CART_REMOVE_ITEM_START,
        itemId: itemId
    };
};
export const removeItemSuccess = (itemId) => {
    return {
        type: actionTypes.CART_REMOVE_ITEM_SUCCESS,
        itemId: itemId
    };
};
export const removeItemSuccessFinal = (itemId) => {
    return {
        type: actionTypes.CART_REMOVE_ITEM_SUCCESS_FINAL,
        itemId: itemId
    };
};
export const removeItemFail = (itemId, error) => {
    return {
        type: actionTypes.CART_REMOVE_ITEM_FAIL,
        itemId: itemId,
        error: error
    };
};
export const removeItem = (authData, itemId) => {
    return dispatch => {
        if (!authData || !authData.type || authData.type !== userTypes.CUSTOMER || !authData.id)
            dispatch(removeItemFail('Invalid auth data'));

        else {
            dispatch(removeItemStart(itemId));
            axiosCart.delete('u' + authData.id + '/c_' + itemId + '.json')
                .then(res => {
                    console.log(res);
                    dispatch(removeItemSuccess(itemId));
                    setTimeout(() => dispatch(removeItemSuccessFinal(itemId)), 150);
                })
                .catch(err => {
                    console.log("error");
                    // console.log(err.response.data.error)
                    if (err.response && err.response.data && err.response.data.error)
                        dispatch(removeItemFail(itemId, err.response.data.error));
                    else
                        dispatch(removeItemFail(itemId, err.message));
                });

        }
    };
};



export const addItemStart = () => {
    return {
        type: actionTypes.CART_ADD_ITEM_START
    };
};
export const addItemSuccess = (itemId) => {
    return {
        type: actionTypes.CART_ADD_ITEM_SUCCESS,
        itemId: itemId
    };
};
export const addItemFail = (itemId, error) => {
    return {
        type: actionTypes.CART_ADD_ITEM_FAIL,
        itemId: itemId,
        error: error
    };
};
export const addItem = (authData, item) => {
    return dispatch => {
        if (!authData || !authData.type || authData.type !== userTypes.CUSTOMER || !authData.id)
            dispatch(addItemFail('Invalid auth data'));

        else {
            const itemData = { ...item }, itemId = item.id, newItem = {};
            delete itemData['id'];
            newItem['c_' + itemId] = { ...itemData };

            dispatch(addItemStart(itemId));
            axiosCart.patch('u' + authData.id + '.json', newItem)
                .then(res => {
                    console.log(res);
                    dispatch(addItemSuccess(itemId));

                })
                .catch(err => {
                    console.log("error");
                    // console.log(err.response.data.error)
                    if (err.response && err.response.data && err.response.data.error)
                        dispatch(addItemFail(itemId, err.response.data.error));
                    else
                        dispatch(addItemFail(itemId, err.message));
                });

        }
    };
};





export const purchaseItemStart = (itemId) => {
    console.log('purchaseItemStart()');
    return {
        type: actionTypes.CART_PURCHASE_ITEM_START,
        itemId: itemId
    };
};
export const purchaseItemSuccess = (itemId) => {
    console.log('purchaseItemStart()');
    return {
        type: actionTypes.CART_PURCHASE_ITEM_SUCCESS,
        itemId: itemId
    };
};
export const purchaseItemFail = (itemId, error) => {
    return {
        type: actionTypes.CART_PURCHASE_ITEM_FAIL,
        itemId: itemId,
        error: error
    };
};
export const purchaseItem = (authData, itemId) => {
    ////////////    TODO        ///////////
    // axios request to jersey server.
    // if successful dispatch purchaseItemSuccess
    // and timeout for 5 seconds to dispatch removeItem
    // -> to remove it from the list and from the cart.
    //
    // Make purchaseCart recursive so that it runs purchaseItem on each item in the cart.
    return dispatch => {
        if (!authData || !authData.type || authData.type !== userTypes.CUSTOMER || !authData.id)
            dispatch(purchaseItemFail('Invalid auth data'));

        else {
            dispatch(purchaseItemStart(itemId));
            axios.post('/coupons/' + itemId + '/purchase')
                .then(res => {
                    console.log(res);
                    if (res.data && res.data.error)
                        dispatch(purchaseItemFail(itemId, res.data.error));
                    else {
                        dispatch(purchaseItemSuccess(itemId));
                        setTimeout(() => dispatch(removeItem(authData, itemId)), 2000);
                    }
                    execNext(); // go to next action in queue
                })
                .catch(err => {
                    console.log(err);
                    if (err.response && err.response.data && err.response.data.error)
                        dispatch(purchaseItemFail(itemId, err.response.data.error));
                    else
                        dispatch(purchaseItemFail(itemId, err.message));

                    execNext(); // go to next action in queue
                });

        }
    };
};









export const purchaseCartStart = () => { // set all items to loading: true;
    console.log('purchaseCartStart()');
    return {
        type: actionTypes.CART_PURCHASE_START
    };
};
export const purchaseCartSuccess = () => {
    console.log('purchaseCartSuccess()');
    return {
        type: actionTypes.CART_PURCHASE_SUCCESS
    };
};
export const purchaseCartFail = (error) => {
    console.log('purchaseCartFail()');
    return {
        type: actionTypes.CART_PURCHASE_FAIL,
        error: error
    };
};
export const purchaseCart = (authData) => {
    // set all of the items to loading: true
    // queue a purchase item action for each item.
    return dispatch => {
        if (!authData || !authData.type || authData.type !== userTypes.CUSTOMER || !authData.id)
            dispatch(purchaseCartFail('Invalid auth data'));

        else {
            dispatch(purchaseCartStart()); // set all items to loading: true;
            axiosCart.get('u' + authData.id + '.json')
                .then(res => {
                    console.log("get request");
                    console.log(res);
                    if (res.data) {
                        if (!res.data.error) {
                            // dispatch(purchaseCartSuccess(res.data));
                            const cart = utils.getCartFromJson(res.data);
                            for (let key in cart)
                                queue.push(() => dispatch(purchaseItem(authData, key)));
                            queue.push(() => dispatch(purchaseCartSuccess()));
                            console.log(queue);

                            execNext(); // start executing the queue.
                        } else dispatch(purchaseCartFail(res.data.error));
                    }
                    else
                        dispatch(purchaseCartFail());

                })
                .catch(err => {
                    console.log("error");
                    // console.log(err.response.data.error)
                    if (err.response && err.response.data && err.response.data.error)
                        dispatch(purchaseCartFail((err.response.data.error)));
                    else
                        dispatch(purchaseCartFail((err.message)));
                });

        }
    };
};

