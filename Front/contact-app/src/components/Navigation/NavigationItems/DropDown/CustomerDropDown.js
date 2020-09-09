import React from 'react'

import DropDown from './DropDown';
import DropDownItem from './DropDownItem/DropDownItem';

const customerDropDown = (props) => (
    <DropDown header={"Welcome " + props.auth.name} >
        <DropDownItem link='/cart' exact>Cart</DropDownItem>
        <DropDownItem link='/coupons/my' exact>My coupons</DropDownItem>
        {/* <DropDownItem link='/profile' exact>My account</DropDownItem> */}
        <DropDownItem link='/update' exact>Update info</DropDownItem>
        <DropDownItem hideActive onClick={props.onLogout}>Logout</DropDownItem>
    </DropDown>
);

export default customerDropDown;