import React from 'react';

import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Ax from '../../../hoc/Ax';
import classes from './SideDrawer.css'

const sideDrawer = (props) => {
    const attachedClasses = [classes.SideDrawer, props.show ? classes.Open : classes.Close].join(' ');

    return (
        <Ax>
            <Backdrop show={props.show} close={props.close} />
            <div className={attachedClasses}>
                <div className={classes.Logo}>
                    <Logo />
                </div>
                <nav>
                    <NavigationItems />
                </nav>
            </div>
        </Ax>
    );
}

export default sideDrawer;