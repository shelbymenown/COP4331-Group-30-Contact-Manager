import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Spinner from '../../components/UI/Spinner/Spinner';
import Ax from '../../hoc/Ax';
import * as actions from '../../store/actions/actions';
import * as userTypes from '../../store/userTypes';
import * as utils from '../../store/util';
import classes from './Income.css';

class Income extends Component {

    state = {
        collapsed: null
    }

    componentWillMount() {
        const { onIncomeMount, auth } = this.props;
        if (auth && auth.type === userTypes.ADMIN)
            onIncomeMount();
    }

    // collapse
    handleClick = (e, id) => {
        e.preventDefault();
        this.setState({ collapsed: this.state.collapsed === id ? null : id });
    }

    render() {
        const { income, loading, error, auth } = this.props,
            { collapsed } = this.state,
            isAdmin = auth && auth.type === userTypes.ADMIN;
        let count = 0;

        console.log(auth);


        const incomeItems = loading || error || !isAdmin ? null : income.map(i => (
            <Ax>
                <ListItem key={i.id} button divider={++count < income.length} onClick={e => this.handleClick(e, i.id)}>
                    <ListItemAvatar>
                        <Avatar style={{ backgroundColor: utils.stringToColor(i.name) }}>+</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={i.description}
                        inset
                    />
                </ListItem>
                <Collapse in={collapsed === i.id} timeout="auto" unmountOnExit>
                    <div className={classes.Nested} >
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar style={{ backgroundColor: utils.stringToColor(i.name) }}>{i.name ? i.name[0].toUpperCase() : 'O'}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={i.name}
                                secondary={moment(i.date, 'YYYY-MM-DD', true).format('L')}
                                inset
                            />
                        </ListItem>
                    </div>
                </Collapse>
            </Ax>
        ))
        return (
            <div className={classes.Container} >
                <h1 style={{ textAlign: 'center' }}>Income</h1>
                {!isAdmin ? <h5>You are unauthorized for this page!</h5> : null}
                {error ? <h1>{error}</h1> : null}
                {loading ? <Spinner /> :
                    <List component="nav">
                        {incomeItems}
                    </List>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.user,
        income: state.income.income,
        error: state.income.error,
        loading: state.income.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIncomeMount: () => dispatch(actions.loadIncome())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Income);