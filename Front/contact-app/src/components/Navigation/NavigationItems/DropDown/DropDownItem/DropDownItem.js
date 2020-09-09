import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from '../DropDown.css';

const dropDownItem = (props) => (
    <li className={classes.Dropdown_Item}>
        {props.link ? 
        <NavLink
            to={props.link}
            onClick={props.onClick}
            exact={props.exact}
            activeClassName={props.hideActive ? '' : classes.active}>
            {props.children}
        </NavLink> : <a onClick={props.onClick}>{props.children}</a>}
    </li>
);

export default dropDownItem;