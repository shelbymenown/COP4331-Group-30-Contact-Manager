import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Ax from '../../../hoc/Ax';
import classes from './FilterSection.css';


class FilterSection extends Component {
    state = {
        selection: "",
    }



    handleChange = e => {
        this.setState({ selection: e.target.value });
    };

    handleAdd = () => {
        this.props.toggle(this.state.selection)
        this.setState({ selection: "" })
    }

    handleReset = () => {
        this.props.reset()
        this.setState({ selection: "" })
    }

    render() {
        // console.log(this.props.tags);
        let menuItems = [], chips = [], firstArg = 'All';
        for (let key in this.props.tags) {
            if (!this.props.tags[key])
                menuItems.push(
                    <MenuItem key={key} value={key}>
                        {key}
                    </MenuItem>
                );
            else chips.push(
                <Chip
                    key={key}
                    label={key}
                    onDelete={() => this.props.toggle(key)}
                    className={classes.Chip}
                />
            );
        }

        if (chips.length > 0)
            firstArg = 'Select catagories..';

        menuItems.unshift(
            <MenuItem key="firstArg" value="" disabled>
                {firstArg}
            </MenuItem>
        );


        return (
            <Ax>
                <div className={classes.Selection}>
                    <FormControl>
                        <Select
                            label={"Filter by catagory"}
                            value={this.state.selection}
                            onChange={this.handleChange}
                            name="catagory"
                            displayEmpty
                            className={classes.Select}
                        >
                            {menuItems}
                        </Select>
                        <FormHelperText>Filter by catagory</FormHelperText>
                    </FormControl>
                </div>
                <div className={classes.Buttons}>
                    <Button
                        variant='outlined'
                        color='primary'
                        disabled={!this.state.selection}
                        onClick={() => this.handleAdd(this.state.selection)}
                        className={classes.Button}
                    >
                        add
                </Button>
                    <Button
                        variant='outlined'
                        color='secondary'
                        disabled={chips === undefined || chips.length === 0}
                        onClick={() => this.handleReset()}
                        className={classes.Button}
                    >
                        reset
                </Button>
                </div>
                <span className={classes.Space} />
                <div className={classes.Chips}>
                    {chips}
                </div>
            </Ax>
        );
    }
}

export default FilterSection;