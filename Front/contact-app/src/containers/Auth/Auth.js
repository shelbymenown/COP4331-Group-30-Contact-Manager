import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import classes from './Auth.css';
import * as actions from '../../store/actions/actions';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import Ax from '../../hoc/Ax';
import Spinner from '../../components/UI/Spinner/Spinner';

class Auth extends Component {

    initState = {
        username: "",
        usernameError: "",
        password: "",
        passwordError: "",
        firstName: "",
        firstNameError: "",
        lastName: "",
        lastNameError: "",
        email: "",
        emailError: "",
        passwordConfirm: "",
        isCompany: false,
    };

    state = {
        ...this.initState,
        isLogin: true,
        ready: true
    }

    loginForm = () => (
        <Ax>
            <TextField
                name="username"
                hintText="Username"
                floatingLabelText="Username"
                value={this.state.username}
                onChange={e => this.change(e)}
                errorText={this.state.usernameError}
                floatingLabelFixed
            />
            <TextField
                type="password"
                name="password"
                hintText="Password"
                floatingLabelText="Password"
                value={this.state.password}
                onChange={e => this.change(e)}
                errorText={this.state.passwordError}
                floatingLabelFixed
            /><br />
            <Checkbox
                checked={this.state.isCompany}
                onClick={() => this.handleCheck()}
                label="Company"
                color="primary"
            /><br />
        </Ax>
    );

    signUpForm = () => (
        <Ax>
            <TextField
                name="username"
                hintText="Username"
                floatingLabelText="Username"
                value={this.state.username}
                onChange={e => this.change(e)}
                errorText={this.state.usernameError}
                floatingLabelFixed
            />
            <TextField
                type="password"
                name="password"
                hintText="Password"
                floatingLabelText="Password"
                value={this.state.password}
                onChange={e => this.change(e)}
                errorText={this.state.passwordError}
                floatingLabelFixed
            /><br />
            <TextField
                type="password"
                name="passwordConfirm"
                hintText="Retype the password"
                floatingLabelText="Retype the password"
                value={this.state.passwordConfirm}
                onChange={e => this.change(e)}
                errorText={this.state.passwordError}
                floatingLabelFixed
            /><br />
            <TextField
                type="email"
                name="email"
                hintText="Email"
                floatingLabelText="Email"
                disabled={!this.state.isCompany}
                value={this.state.email}
                onChange={e => this.change(e)}
                errorText={this.state.emailError}
                floatingLabelFixed
            /><br />
            <TextField
                name="firstName"
                hintText="First Name"
                floatingLabelText="First Name"
                value={this.state.firstName}
                onChange={e => this.change(e)}
                errorText={this.state.firstNameError}
                floatingLabelFixed
            /><br />
            <TextField
                name="lastName"
                hintText="Last Name"
                floatingLabelText="Last Name"
                value={this.state.lastName}
                onChange={e => this.change(e)}
                errorText={this.state.lastNameError}
                floatingLabelFixed
            /><br />
            <Checkbox
                checked={this.state.isCompany}
                onClick={() => this.handleCheck()}
                label="Company"
                color="primary"
            /><br />
        </Ax>
    );

    componentWillUpdate(nextProps, nextState) {
        // console.log("[AUTH]: componentDidUpdate()", this.props, this.state);

        // console.log("[AUTH]: componentDidUpdate()", nextProps, nextState);

        if (nextProps.auth && !this.props.auth)
            nextProps.history.push('/');

        else if (nextState.isLogin !== this.state.isLogin)
            this.setState({ ...this.initState, isLogin: nextState.isLogin });
    }

    validate = () => {
        const errors = {};

        if (!this.state.username)
            errors.usernameError = "Can't be empty";
        else if (this.state.username.indexOf(' ') !== -1)
            errors.usernameError = "Can't contain spaces!";

        if (this.state.password.length < 5)
            errors.passwordError = "Must be atleast 5 characters long";
        else if (this.state.password.indexOf(' ') !== -1)
            errors.passwordError = "Can't contain spaces!";

        if (!this.state.isLogin) {
            const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

            if (this.state.lastName.length < 5)
                errors.lastNameError = "Must be atleast 5 characters long";

            if (this.state.firstName.length < 5)
                errors.firstNameError = "Must be atleast 5 characters long";

            else if (!errors.passwordError && this.state.password !== this.state.passwordConfirm)
                errors.passwordError = "Passwords should match";

            if (this.state.isCompany)
                if (this.state.email.length < 5 || !emailPattern.test(this.state.email))
                    errors.emailError = "Requires valid email";
        }

        if (!(Object.keys(errors).length === 0 && errors.constructor === Object)) {
            this.setState({
                lastNameError: "",
                usernameError: "",
                firstNameError: "",
                emailError: "",
                passwordError: "",
                ...errors
            });
            return false;
        }

        return true;
    }

    handleCheck = () => this.setState({ isCompany: !this.state.isCompany });

    change = (e) => this.setState({ [e.target.name]: e.target.value });

    submit = (e) => {
        e.preventDefault();
        if (this.validate()) {
            if (this.state.isLogin)
                this.props.onAuth(this.state.username, this.state.password, this.state.isCompany);
            else {
                if (this.state.isCompany)
                    this.props.onSignUp({
                        username: this.state.username,
                        password: this.state.password,
                        email: this.state.email
                    }, this.state.isCompany);
                else
                    this.props.onSignUp({
                        username: this.state.username,
                        password: this.state.password
                    }, this.state.isCompany);
                this.toggle()
            }
        }
    }

    toggle = () => {
        this.setState({ isLogin: !this.state.isLogin, ready: false });
        // this.setState({ isLogin: !this.state.isLogin });
        setTimeout(() => {
            this.setState({ ready: true })
        }, 500);
    }

    render() {

        let prmLbl = 'Sign In';
        let sndLbl = 'Sign Up';
        let hdrLbl = 'Enter your username and password';

        if (!this.state.isLogin) {
            prmLbl = 'Submit';
            sndLbl = 'Sign In';
            hdrLbl = 'Fill the form to sign up';
        }

        return (
            <div className={classes.Auth}>
                {!this.props.auth && !this.props.success ?
                    <form onSubmit={e => this.submit(e)}>
                        <h3>{hdrLbl}</h3>
                        {this.props.loading ?
                            <Spinner /> :
                            (<Ax>
                                {/* <div className={this.state.isLogin ? classes.active : ''}>{this.signUpForm()}</div> */}
                                <div className={
                                    [classes.Contained, (this.state.isLogin && this.state.ready) ? classes.active : ''].join(' ')}>
                                    {this.loginForm()}
                                </div>
                                <div className={
                                    [classes.Contained, (!this.state.isLogin && this.state.ready) ? classes.active : ''].join(' ')}>
                                    {this.signUpForm()}
                                </div>
                            </Ax>
                            )}
                        {this.props.error ? <h5>{this.props.error}</h5> : null}
                        <RaisedButton type="submit" label={prmLbl} primary onClick={e => this.submit(e)} style={{ margin: '7px 10px' }} />
                        Or
                        <RaisedButton label={sndLbl} secondary onClick={this.toggle} style={{ margin: '7px 10px' }} />
                        {/* SHOW MODAL IF  this.props.error*/}
                        {/* SHOW SPINNER IF  this.props.loading */}
                    </form> : this.props.success ? <h1>{this.props.success}</h1> : <h3>You are already logged in!</h3>}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        success: state.auth.signedUp,
        auth: state.auth.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, password, isCompany) => dispatch(actions.auth(username, password, isCompany)),
        onSignUp: (userData, isCompany) => dispatch(actions.signUp(userData, isCompany)),
        onLogout: () => dispatch(actions.logout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Auth));