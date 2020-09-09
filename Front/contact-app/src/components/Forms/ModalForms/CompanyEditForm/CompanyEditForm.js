import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RaisedButton from 'material-ui/RaisedButton';
import Ax from '../../../../hoc/Ax';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '@material-ui/core/Button/Button';
import TextField from 'material-ui/TextField';

class CompanyEditForm extends Component {
    state = {
        company: {
            ...this.props.company
        },
        emailError: '',

        submitted: false
    }

    componentDidMount() {
        if (this.props.company)
            this.setState({
                company: {
                    ...this.props.company
                }
            });
    }

    componentDidUpdate() {
        const { loading, error, handleClose } = this.props;
        const { submitted } = this.state;
        
        console.log(this.props);

        if (submitted && !loading && !error)
            handleClose();
    }

    validate() {
        const { company } = this.state;
        const errors = {};
        const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

        if (company.email.length < 5 || !emailPattern.test(company.email))
            errors.emailError = "Requires valid email";

        if (!(Object.keys(errors).length === 0 && errors.constructor === Object)) {
            this.setState({
                emailError: '',
                ...errors
            });
            return false;
        }

        return true;
    }


    submit = () => {
        if (!this.props.loading) {
            if (this.validate()) {
                this.props.handleSave(this.state.company)
                this.setState({ submitted: true });
                setTimeout(() => this.setState({ submitted: false }), 3000);
            }
        }
    }


    handleChange = e => this.setState({ company: { ...this.state.company, [e.target.name]: e.target.value } });

    render() {
        const { loading, error, handleSave, handleClose } = this.props;
        const { company } = this.state;

        return !company ? null : (
            <Dialog
                open={company ? true : false}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Edit Company</DialogTitle>
                <DialogContent>
                    {loading ?
                        <div style={{ width: '550px' }}><Spinner /></div> : (
                            <Ax>
                                <TextField
                                    style={{ marginRight: '30px' }}
                                    name="id"
                                    hintText="Company ID"
                                    floatingLabelText="Id"
                                    value={company.id}
                                    disabled
                                    floatingLabelFixed
                                />
                                <TextField
                                    name="name"
                                    hintText="Company name"
                                    floatingLabelText="Name"
                                    value={company.name}
                                    disabled
                                    floatingLabelFixed
                                />
                                <TextField
                                    name="email"
                                    hintText="Enter email address"
                                    floatingLabelText="Email"
                                    value={company.email}
                                    onChange={this.handleChange}
                                    errorText={this.state.emailError}
                                    floatingLabelFixed
                                    fullWidth
                                />

                                {error ? <h5>{error}</h5> : null}
                            </Ax>
                        )}
                </DialogContent >
                <DialogActions>
                    <DialogActions>
                        <RaisedButton onClick={this.submit} label='Save' primary style={{ margin: '7px 10px' }} />
                        <RaisedButton label='Cancel' secondary onClick={handleClose} style={{ margin: '7px 10px' }} />
                    </DialogActions>
                </DialogActions>
            </Dialog >
        )
    }
}

export default CompanyEditForm;