import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import moment from 'moment';

import InputAdornment from '@material-ui/core/InputAdornment';
import { Typography } from '@material-ui/core';
import DatePicker from 'react-datepicker';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Ax from '../../hoc/Ax';
import Spinner from '../../components/UI/Spinner/Spinner';

import classes from './CreateCoupon.css';
import * as actions from '../../store/actions/actions';
import * as userTypes from '../../store/userTypes';

const style = {
	width: '400px'
};


class CreateCoupon extends Component {
	initState = {
		coupon: {
			title: '',
			type: '',
			startDate: moment(),
			endDate: moment().add(1, 'days'),
			image: '',
			amount: 1,
			price: 1,
			message: ''
		},

		titleError: '',
		typeError: '',
		startDateError: '',
		endDateError: '',
		imageError: '',
		amountError: '',
		priceError: '',
		messageError: '',
	};

	state = {
		...this.initState,
		// isLogin: true,
		ready: true
	}

	componentDidMount() {
		this.props.onCatagoryMount();
	}

	validate = () => {
		const { coupon } = this.state;
		const errors = {};

		if (coupon.title.length < 10)
			errors.titleError = "Must be atleast 10 characters long"
		if (!coupon.type)
			errors.typeError = "Must select a catagory";
		// else if (this.state.username.indexOf(' ') !== -1)
		//     errors.usernameError = "Can't contain spaces!";
		// image: '',
		// amount: 5,
		// price: 0.0,
		// message: '',
		if (~~coupon.amount < 1)
			errors.amountError = "Must have atleast 1 coupon in stock";
		if (Math.round(coupon.price * 1e2) / 1e2 <= 0)
			errors.priceError = "Has to be larger than 0";
		if (coupon.message.length < 10)
			errors.messageError = "Must be atleast 10 characters long"
		if (coupon.image.length < 5)
			errors.imageError = "Must be atleast 5 characters long"

		if (!(Object.keys(errors).length === 0 && errors.constructor === Object)) {
			this.setState({
				amountError: "",
				priceError: "",
				messageError: "",
				imageError: "",
				...errors
			});
			return false;
		}

		return true;
	}

	change = e => this.setState({ coupon: { ...this.state.coupon, [e.target.name]: e.target.value } });
	handleEndDateChance = date => this.setState({ coupon: { ...this.state.coupon, endDate: date } });
	handleStartDateChance = date => {
		const nextDay = moment(date).add(1, 'days');
		if (moment(this.state.coupon.endDate).isBefore(nextDay))
			this.setState({ coupon: { ...this.state.coupon, startDate: date, endDate: nextDay } });
		else
			this.setState({ coupon: { ...this.state.coupon, startDate: date } });
	}

	submit = e => {
		e.preventDefault();
		if (this.validate()) {
			const { coupon } = this.state;
			const { auth } = this.props;
			this.props.onCreate(auth, {
				...coupon,
				startDate: moment(coupon.startDate).format('YYYY-MM-DD'),
				endDate: moment(coupon.endDate).format('YYYY-MM-DD'),
				price: Math.round(coupon.price * 1e2) / 1e2,
				amount: ~~coupon.amount
			});
			this.setState({ ...this.initState });
		}
	}


	render() {
		const { auth, loading, error, catagories, success } = this.props;
		const { coupon } = this.state;

		console.log(catagories);

		const catagoryMenuItems = [<MenuItem key="first-Arg" value="" disabled>{this.state.typeError ? this.state.typeError : 'Select a catagory'}</MenuItem>];
		catagoryMenuItems.push(
			!catagories || !Object.keys(catagories) ? null :
				Object.keys(catagories).map(key => <MenuItem key={key} value={key.toUpperCase()}>{key}</MenuItem>)
		);

		return (

			<div className={classes.Create}>
				{(auth && auth.type && (auth.type === userTypes.ADMIN || auth.type === userTypes.COMPANY)) ?
					success ? <h3>Coupon created!</h3> :
						<form onSubmit={e => this.submit(e)}>
							<h3>Fill in the form to create a new coupon</h3>
							{loading ?
								<Spinner /> :
								<div className={classes.Contained}>
									<TextField
										style={style}
										name="title"
										hintText="Enter a title"
										floatingLabelText="Title"
										value={coupon.title}
										onChange={this.change}
										errorText={this.state.titleError}
										floatingLabelFixed
									/><br />
									<Select
										style={{ ...style, marginTop: '10px', marginBottom: '10px' }}
										label={"Select a catagory"}
										value={coupon.type}
										onChange={this.change}
										name="type"
										displayEmpty
										fullWidth
										className={classes.Select}
									>
										{catagoryMenuItems}
									</Select><br /><br />
									<div className={classes.Date}>
										<div className={classes.Left}>
											<div className={classes.Block}>
												<Typography paragraph variant="subheading">Available since</Typography>
												<DatePicker
													onChange={this.handleStartDateChance}
													selected={coupon.startDate}
													minDate={moment()}
													inline
													disabled
												/>
											</div>
										</div>
										<div className={classes.Right}>
											<div className={classes.Block}>
												<Typography paragraph variant="subheading">Available until</Typography>                                        <DatePicker
													onChange={this.handleEndDateChance}
													selected={coupon.endDate}
													minDate={moment.max(moment().add(1, 'days'), moment(coupon.startDate).add(1, 'days'))}
													inline
												/>
											</div>
										</div>
									</div>
									<TextField
										style={style}
										name="image"
										hintText="Enter image url"
										floatingLabelText="Image"
										value={coupon.image}
										onChange={this.change}
										errorText={this.state.imageError}
										floatingLabelFixed
									/><br />
									<TextField
										style={style}
										type="number"
										name="amount"
										hintText="Number of coupons available"
										floatingLabelText="Amount"
										value={coupon.amount}
										onChange={this.change}
										errorText={this.state.amountError}
										floatingLabelFixed
									/><br />
									<TextField
										style={style}
										type="number"
										name="price"
										hintText="Price of coupon"
										floatingLabelText="Price"
										value={coupon.price}
										onChange={this.change}
										errorText={this.state.priceError}
										floatingLabelFixed
										InputProps={{
											inputProps: {
												startAdornment: <InputAdornment position="start">$</InputAdornment>
											}
										}}
									/><br />
									<TextField
										style={style}
										name="message"
										hintText="Enter a description"
										floatingLabelText="Description"
										value={coupon.message}
										onChange={this.change}
										errorText={this.state.messageError}
										floatingLabelFixed
										multiLine={true}
										rowsMax={4}
									/><br />
								</div>
							}
							{this.props.error ? <h5>{this.props.error}</h5> : null}
							<br />
							<div className={classes.FormActions}>
								<RaisedButton
									className={classes.BundledButtons}
									type="submit"
									label={'Create!'}
									primary
									onClick={this.submit}
									style={{ margin: '7px 10px' }} />
							</div>
						</form> : <h3>You are unauthorized for this action!</h3>}
			</div>
		);
	}


}

const mapStateToProps = state => {
	return {
		loading: state.coupons.creating,
		success: state.coupons.createSuccess,
		error: state.coupons.createError,
		catagories: state.catagory.catagories,
		auth: state.auth.user
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onCatagoryMount: () => dispatch(actions.loadCatagory()),
		onCreate: (authData, coupon) => dispatch(actions.createCoupon(authData, coupon))
	};
};


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateCoupon));