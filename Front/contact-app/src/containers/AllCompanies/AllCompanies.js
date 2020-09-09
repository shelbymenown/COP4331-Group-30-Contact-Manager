import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Spinner from '../../components/UI/Spinner/Spinner';
import Ax from '../../hoc/Ax';

import CompanyEditForm from '../../components/Forms/ModalForms/CompanyEditForm/CompanyEditForm';
import CompanyDeleteForm from '../../components/Forms/ModalForms/CompanyDeleteForm/CompanyDeleteForm';

import * as actions from '../../store/actions/actions';
import * as userTypes from '../../store/userTypes';
import * as utils from '../../store/util';
import classes from './AllCompanies.css';


class AllCompanies extends Component {

    state = {
        formCompany: null,
        isOpen: false,
        isEdit: false,
        collapsed: null
    }

    componentWillMount() {
        const { onCompaniesMount } = this.props;

        onCompaniesMount();
    }


    // collapse
    handleClick = (e, id) => {
        e.preventDefault();
        this.setState({ collapsed: this.state.collapsed === id ? null : id });
    }


    handleEdit = company => this.setState({ isEdit: true, isOpen: true, formCompany: company });
    handleEditClose = () => this.setState({ isOpen: false, formCompany: null });
    handleEditSave = company => this.props.onCompanyEdit(this.props.auth, company);

    handleRemove = company => this.setState({ isEdit: false, isOpen: true, formCompany: company });
    handleRemoveClose = () => this.setState({ isOpen: false, formCompany: null });
    handleRemoveConfirm = company => this.props.onCompanyDelete(this.props.auth, company);


    // onEditCancel
    // onEditSave

    // onRemove
    // onRemoveCancel
    // onRemoveConfirm

    render() {
        const { companies, loading, error, auth } = this.props,
            { collapsed } = this.state,
            isAdmin = auth && auth.type === userTypes.ADMIN;
        let count = 0;

        console.log(this.props)

        const comanyListItems = (loading || error) ? null : companies.map(c => (
            <Ax key={c.id}>
                <ListItem component={Link} to={'/company/' + c.id} button divider={++count < companies.length} onClick={e => this.handleClick(e, c.id)}>
                    <ListItemAvatar>
                        <Avatar style={{ backgroundColor: utils.stringToColor(c.name) }}>{c.name ? c.name[0].toUpperCase() : null}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={c.name}
                        secondary={c.email}
                    />
                    {/* <ListItemText inset primary="inline text" /> */}
                    <ListItemSecondaryAction>
                        <IconButton aria-label="Edit" onClick={() => this.handleEdit(c)} disabled={!(isAdmin || (auth && auth.type === userTypes.COMPANY && auth.id === c.id))}>
                            <EditIcon />
                        </IconButton>
                        <IconButton aria-label="Delete" onClick={() => this.handleRemove(c)} disabled={!isAdmin}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem >
                <Collapse in={collapsed === c.id && c.coupons} timeout="auto" unmountOnExit>
                    <div className={classes.Nested} >
                        {/* <List component="div"> */}
                        {c.coupons.map(cp => (
                            <ListItem button component='div' key={cp.id}>
                                <ListItemAvatar>
                                    <Avatar style={{ backgroundColor: 'red' }}>C</Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={cp.title} secondary={cp.type} />
                            </ListItem>
                        ))}
                    </div>
                    {/* </List> */}
                </Collapse>
            </Ax>
        ));

        return (
            <div className={classes.Container} >
                <h1 style={{ textAlign: 'center' }}>All Companies</h1>
                {error ? <h1>{error}</h1> : null}
                {loading ? <Spinner /> :
                    <Ax>
                        <List component="nav">
                            {comanyListItems}
                        </List>
                        {!this.state.isOpen ? null :
                            this.state.isEdit ?
                                <CompanyEditForm
                                    company={this.state.formCompany}
                                    handleSave={this.handleEditSave}
                                    handleClose={this.handleEditClose}
                                    loading={this.props.editing}
                                    error={this.props.editError}
                                />
                                : // (REMOVE FORM)
                                <CompanyDeleteForm
                                    company={this.state.formCompany}
                                    handleDelete={this.handleRemoveConfirm}
                                    handleClose={this.handleRemoveClose}
                                    loading={this.props.deleting}
                                    error={this.props.deleteError}
                                />
                        }

                    </Ax>
                }

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        companies: state.companies.companies,
        deleting: state.companies.deleting,
        editing: state.companies.editing,
        loading: state.companies.loading,
        deleteError: state.companies.deleteError,
        editError: state.companies.editError,
        error: state.companies.error,
        auth: state.auth.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onCompaniesMount: () => dispatch(actions.loadCompanies()),
        onCompanyEdit: (authData, company) => dispatch(actions.editCompany(authData, company)),
        onCompanyDelete: (authData, company) => dispatch(actions.deleteCompany(authData, company))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllCompanies);
                    // export default connect(mapStateToProps, mapDispatchToProps)(AllCompanies);

/* <Typography variant="title" className={classes.title}>
                        All Companies
</Typography> */