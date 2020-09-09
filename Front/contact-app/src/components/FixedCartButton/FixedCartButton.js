import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button/Button';
import CartIcon from '@material-ui/icons/ShoppingCart';

import myClasses from './FixedCartButton.css';

const styles = theme => ({
    margin: {
        margin: theme.spacing.unit * 2,
    },
    icon: {
        color: '#ffffff'
    }
});

const theme = createMuiTheme({
    palette: {
        primary: green
    },
});

const fixedCartButton = ({ show, number, classes }) => {
    return (
        <div className={myClasses.Cart}>
            <MuiThemeProvider theme={theme}>
                {number < 1 || !show ? (
                    <Button className={classes.margin} variant="fab" disabled color='primary' aria-label="add">
                        <CartIcon className={classes.icon} />
                    </Button>)
                    :
                    (<Badge className={classes.margin} badgeContent={number} color="secondary">
                        <Link to='/cart'>
                            <Button variant="fab" color='primary' aria-label="add">
                                <CartIcon className={classes.icon} />
                            </Button>
                        </Link>
                    </Badge>)
                }
            </MuiThemeProvider>
        </div>
    );
}

export default withStyles(styles)(fixedCartButton);