import React, { Component } from 'react';
import DropDownHeader from './DropDownHeader/DropDownHeader.js';
import classes from './DropDown.css';

class DropDown extends Component {
    state = {
        dropDown: false
    };

    dropDownHandler = () => this.setState({ dropDown: !this.state.dropDown });

    render() {
        return (
            <div className={classes.Dropdown}>
                <DropDownHeader>{this.props.header}</DropDownHeader>
                <div className={classes.dropdownContent}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default DropDown;