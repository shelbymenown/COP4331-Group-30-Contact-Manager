import React, { Component } from 'react';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import Spinner from '../../components/UI/Spinner/Spinner';
import Ax from '../../hoc/Ax';
import CouponItem from '../../components/Cart/CouponItem/CouponItem';
import RaisedButton from 'material-ui/RaisedButton';

import * as actions from '../../store/actions/actions';
import * as userTypes from '../../store/userTypes';
import * as utils from '../../store/util';
import classes from './Cart.css';
import { Collapse } from '@material-ui/core';


class Cart extends Component {
    state = {
        collapsed: null,
        showSummary: false
    }

    isCustomer = (auth) => auth && auth.type === userTypes.CUSTOMER;

    componentDidMount() {
        const { auth, onMountCart, onMountCoupons } = this.props;
        if (this.isCustomer(auth)) {
            onMountCoupons();
            onMountCart(auth);
        }
    }

    getCoupon = key => {
        const { coupons } = this.props
        for (let c in coupons) {
            if (coupons[c].id == key)
                return coupons[c];
        }
        return null;
    }

    toggleSummary = () => this.setState({ showSummary: !this.state.showSummary });


    handleClick = (e, id) => {
        e.preventDefault();
        this.setState({ collapsed: this.state.collapsed === id ? null : id });
    }

    // collapse the item so it disappears smoothly
    handleRemove = coupon => {
        // // dispatch remove item
        const { auth, loading, itemsCount, purchasing, onRemoveItem } = this.props;
        if (!purchasing && !loading && itemsCount > 0 || this.isCustomer(auth))
            onRemoveItem(auth, coupon);
    }
    // this.setState({ isEdit: false, isOpen: true, formCoupon: coupon });

    handlePurchase = () => {
        // dispatch purchaseCart..
        const { auth, onPurchaseCart } = this.props;
        onPurchaseCart(auth);
    }

    render() {
        const { cart, itemsCount, loading, error, auth, purchased, purchasing } = this.props,
            { collapsed, showSummary } = this.state;
        let isCustomer = this.isCustomer(auth);
        let count = 0;

        // map return CouponItem coupon={getCoupon} clicked={this.handleClick}
        const cartListItems = (loading || error) || !isCustomer || (itemsCount < 1 && !error) ? null : Object.keys(cart).map(key => {
            const coupon = this.getCoupon(key);
            return !coupon ? null :
                <CouponItem
                    key={key}
                    coupon={coupon}
                    divider={++count < itemsCount}
                    clicked={this.handleClick}
                    remove={this.handleRemove}
                    canRemove={!purchasing}
                    collapsedInfo={collapsed === coupon.id}
                    collapseItem={!cart[key].removed}
                    purchased={cart[key].purchased}
                    loading={cart[key].loading}
                    error={cart[key].error}
                />
        });

        return (
            <div className={classes.Container} >
                <h1 style={{ textAlign: 'center' }}>My cart</h1>
                {!isCustomer ? <h3>You are unauthorized to enter this page!</h3> : null}
                {purchased && itemsCount < 1 ? <h3>Successfuly purchased cart!</h3> : null}
                <Ax>
                    {loading ? <Spinner /> :
                        itemsCount < 1 && !error && isCustomer ? <h3>Your cart is empty!</h3> :
                            <Ax>
                                <List component="nav">
                                    {cartListItems}
                                </List>
                            </Ax>
                    }
                    {error ? <h5>{error}</h5> : null}
                    {loading || (itemsCount < 1 && !error) ? null :
                        <Ax>
                            <div className={classes.hrSect} onClick={this.toggleSummary}>
                                <span className={classes.Summary}>Summary</span>
                            </div>
                            <Collapse in={showSummary} timeout='auto' unmountOnExit>
                                <div className={classes.hrSect} onClick={this.toggleSummary}>
                                    <span className={classes.Summary}>Summary</span>
                                </div>
                            </Collapse>
                        </Ax>
                    }
                    {purchasing ? <h5 style={{ color: 'black' }}>Purchasing coupons, please wait...</h5> : null}
                    <div style={{ display: 'block', paddingBottom: '45px' }}>
                        <div className={classes.FormActions}>
                            <RaisedButton
                                className={classes.BundledButtons}
                                disabled={purchasing || loading || itemsCount < 1 || !isCustomer }
                                type="submit"
                                label={'Place Order!'}
                                primary
                                onClick={this.handlePurchase}
                                style={{ margin: '7px 10px' }} />
                        </div>
                    </div>
                </Ax>
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.user,
        cart: state.cart.cart,
        error: state.cart.error,
        loading: state.cart.loading,
        purchased: state.cart.purchased,
        purchasedAll: state.cart.purchasedAll,
        itemsCount: state.cart.items,
        purchasing: state.cart.purchasing,
        coupons: state.coupons.coupons,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onMountCart: (authData) => dispatch(actions.loadCart(authData)),
        onMountCoupons: () => dispatch(actions.loadCoupons()),
        onRemoveItem: (authData, couponId) => dispatch(actions.removeItem(authData, couponId)),
        onPurchaseCart: (authData) => dispatch(actions.purchaseCart(authData))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);