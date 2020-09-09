import { createStore, applyMiddleware, compose } from 'redux';
import createExpirationTransform from 'redux-persist-transform-expire';
import { persistStore, persistCombineReducers } from 'redux-persist';
import createFilter, { createWhitelistFilter, createBlacklistFilter } from 'redux-persist-transform-filter';
import storage from 'redux-persist/es/storage';
import authReducer from './reducers/auth';
import catagoryReducer from './reducers/catagory';
import filterReducer from './reducers/filter';
import couponsReducer from './reducers/coupons';
import myCouponsReducer from './reducers/myCoupons';
import companiesReducer from './reducers/companies';
import incomeReducer from './reducers/income';
import cartReducer from './reducers/cart';
import thunk from 'redux-thunk';
import * as actions from './actions/actionTypes';

// Date.prototype.addHours = function (h) {
//     this.setHours(this.getHours() + h);
//     return this;
// };


const appReducer =
    persistCombineReducers(
        {
            key: 'auth',
            storage,
            whitelist: ['auth'],
            transforms: [
                createBlacklistFilter('auth', ['error', 'loading', 'signedUp'])
            ]
        },
        {
            auth: authReducer,
            catagory: catagoryReducer,
            filter: filterReducer,
            coupons: couponsReducer,
            myCoupons: myCouponsReducer,
            companies: companiesReducer,
            income: incomeReducer,
            cart: cartReducer
        }
    );

const rootReducer = (state, action) => {
    if (action.type === actions.AUTH_LOGOUT) {
        Object.keys(state).forEach(key => {
            storage.removeItem(`persist:${key}`);
        });

        state = undefined
    }
    return appReducer(state, action);
}

const expireTransform = createExpirationTransform({
    expireKey: 'persistExpiresAt',
    defaultState: undefined
});

const saveSubsetFilter = createFilter(
    'auth.user'
);

const logger = store => {
    return next => {
        return action => {
            console.log('[Middleware] Dispatching', action);
            const result = next(action);
            console.log('[Middleware] next state', store.getState());
            return result;
        }
    }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(logger, thunk)));
const persistor = persistStore(store, { transforms: [saveSubsetFilter, expireTransform] });

export { store, persistor };





