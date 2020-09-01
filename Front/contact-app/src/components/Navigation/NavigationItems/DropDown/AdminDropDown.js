import React from 'react';

import * as userTypes from '../../../../store/userTypes';
import DropDown from './DropDown';
import DropDownItem from './DropDownItem/DropDownItem';

const adminDropDown = (props) => (
    <DropDown header={"Welcome " + userTypes.ADMIN} >
        <DropDownItem link='/coupons/create' exact>Create coupon</DropDownItem>
        <DropDownItem link='/income/' exact>Income</DropDownItem>
        <DropDownItem link='/coupons/' exact>Coupons</DropDownItem>
        <DropDownItem link='/company/' exact>Companies</DropDownItem>
        {/* <DropDownItem link='/users/' exact>Users</DropDownItem> */}
        <DropDownItem hideActive onClick={props.onLogout}>Logout</DropDownItem>
    </DropDown>
);

export default adminDropDown;