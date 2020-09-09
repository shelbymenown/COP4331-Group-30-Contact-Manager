import React from 'react';

import * as userTypes from '../../../store/userTypes';
import NavigationItem from './NavigationItem/NavigationItem';
import classes from './NavigationItems.css';
import AdminDropDown from './DropDown/AdminDropDown';
import CompanyDropDown from './DropDown/CompanyDropDown';
import CustomerDropDown from './DropDown/CustomerDropDown';
// import CustomerDropDown from './DropDown/CustomerDropDown';
// Manage GLOBAL REDUX STATE
// NOT LOGGED IN:
//      LOGIN/SIGN UP
// CUSTOMER:
//      Welcome XXXXXX
//          PROPER LIST OF ACTIONS
// COMPANY:
//      Welcome XXXXXX
//          PROPER LIST OF ACTIONS
// ADMIN:
//      Welcome ADMIN
//          PROPER LIST OF ACTIONS 


// props.auth ? 
//             props.auth.type === userTypes.ADMIN ?
//                 <AdminDropDown onLogout={props.onLogout} /> :
//                 props.auth.type === userTypes.COMPANY ?
//                     <CompanyDropDown onLogout={props.onLogout} /> :
//                     props.auth.type === userTypes.CUSTOMER ?
//                         <CustomerropDown onLogout={props.onLogout} /> :
//                         <NavigationItem link="/auth">Sign in/up</NavigationItem>


const getDropDown = (auth, onLogout) => {
    if (!auth)
        return <NavigationItem link="/auth">Sign in/up</NavigationItem>
    switch (auth.type) {
        case userTypes.ADMIN:
            return <AdminDropDown onLogout={onLogout} />
        case userTypes.COMPANY:
            return <CompanyDropDown auth={auth} onLogout={onLogout} />
        default:
            return <CustomerDropDown auth={auth} onLogout={onLogout} />
    }
}


const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        {getDropDown(props.auth, props.onLogout)}
        <NavigationItem link="/search">Search <span className={classes.search}></span> </NavigationItem>
        <NavigationItem link="/" exact>Home</NavigationItem>
        <NavigationItem link="/coupons">All Coupons</NavigationItem>
        <NavigationItem link="/company">All Companies</NavigationItem>
    </ul>
);




// MapStateToProps
// type
// name
// MapDispatchToProps
// 


export default navigationItems;