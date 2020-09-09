import React from 'react';
import classes from '../DropDown.css';

const dropDownHeader = (props) => (
    <li className={classes.Dropdown_Header}>
        <a onClick={props.toggle}>{props.children}</a>
    </li>
);

export default dropDownHeader;