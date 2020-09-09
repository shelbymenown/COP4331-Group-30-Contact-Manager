import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import * as actions from '../../store/actions/actions';

import FixedCartButton from '../FixedCartButton/FixedCartButton';
import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import Ax from '../../hoc/Ax';
import * as userTypes from '../../store/userTypes';


class Layout extends Component {
    state = {
        showSideDrawer: false
    };

    isCustomer() {
        const { auth } = this.props;

        if (auth && auth.type && auth.type === userTypes.CUSTOMER)
            return true; // if this is a customer (logged in)

        return false; // otherwise.
    }

    componentDidMount() {
        const { auth, onMountCart } = this.props;
        if (this.isCustomer())
            onMountCart(auth);
    }

    onLogout = () => {
        const { history, onLogout } = this.props;
        history.push('/');
        onLogout();
    }

    render() {
        const { cartItemsCount, auth, children} = this.props;
        return (
            <Ax>
                <Toolbar onLogout={this.onLogout} auth={auth} />
                {/* <p>I'm wrapped inside an Ax higher order component (HOC)</p> */}
                <div className={classes.Content_Parent}>
                    <main className={classes.Content}>{children}</main>
                    <FixedCartButton show={this.isCustomer()} number={cartItemsCount} />
                </div>
            </Ax>
        );
    }
}

const mapAuthInfo = auth => {
    if (!auth) return null;
    return {
        name: auth.name,
        type: auth.type,
        id: auth.id
    }
}

const mapStateToProps = state => {
    return {
        auth: mapAuthInfo(state.auth.user),
        cartItemsCount: state.cart.items
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout()),
        onMountCart: (authData) => dispatch(actions.loadCart(authData))
        // onUnMountCart: () => dispatch(actions.unloadCart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Layout));