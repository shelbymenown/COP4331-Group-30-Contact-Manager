import React from 'react';
import couponLogo from '../../assets/images/coupon-logo.png';

import classes from './Logo.css';

const UNITS = ["px", "%", "cm", "em", "ex", "in", "mm", "pc", "pt", "vh", "vw", "vmin"];

const isDynamicHeight = (height) => {
    if (height) {
        for (let i = 0; i < UNITS.length; i++) {
            if (height.endsWith(UNITS[i])) {
                if (height.length !== UNITS[i].length)
                    return true;
                else return false;
            }
        }
        return false;
    }
};

const logo = (props) => (
    <div className={classes.Logo}
        style={isDynamicHeight(props.height) ? { height: props.height } : {}}>
        <img src={couponLogo} alt="myCoupon"/>
    </div>
);

export default logo;