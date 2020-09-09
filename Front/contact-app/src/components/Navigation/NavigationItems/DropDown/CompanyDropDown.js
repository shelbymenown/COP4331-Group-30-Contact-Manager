import React from 'react';

import DropDown from './DropDown';
import DropDownItem from './DropDownItem/DropDownItem';

const companyDropDown = (props) => (
    <DropDown header={"Welcome " + props.auth.name} >
        <DropDownItem link='/coupons/create' exact>Create coupon</DropDownItem>
        <DropDownItem link='/coupons/my' exact>My coupons</DropDownItem>
        <DropDownItem link='/update' exact>Update info</DropDownItem>
        <DropDownItem hideActive onClick={props.onLogout}>Logout</DropDownItem>
    </DropDown>
);

export default companyDropDown;