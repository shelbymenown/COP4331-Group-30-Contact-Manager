import React from 'react';

import Logo from '../../Logo/Logo'; 
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';
import classes from './Toolbar.css';

const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <DrawerToggle clicked={props.drawerToggleClicked} />
        <div className={[classes.Logo].join(' ')}>
            <Logo />
        </div>
        <nav className={classes.DesktopOnly}>
            <NavigationItems onLogout={props.onLogout} auth={props.auth}/>
        </nav>

    </header>
);

export default toolbar;
// import Logo