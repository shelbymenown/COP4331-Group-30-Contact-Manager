import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import RaisedButton from 'material-ui/RaisedButton';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Typography } from '@material-ui/core';
import Ax from '../../../hoc/Ax';
import Spinner from '../../UI/Spinner/Spinner';

import Button from '@material-ui/core/Button/Button';
import TextField from 'material-ui/TextField';
import classes from './CouponEditForm.css'

const inputAdornment = () => {
	<InputAdornment position="start">$</InputAdornment>
}


class CouponEditForm extends Component {
	state = {
		coupon: {
			...this.props.coupon
		},
		typeError: '',
		startDateError: '',
		endDateError: '',
		imageError: '',
		amountError: '',
		priceError: '',
		messageError: '',

		submitted: false
	}

	componentDidMount() {
		console.log('[CouponEditForm] componentDidMount', this.props.coupon);
		if (this.props.coupon)
			this.setState({
				coupon: {
					...this.props.coupon,
					startDate: moment(this.props.coupon.startDate, 'YYYY-MM-DD', true),
					endDate: moment(this.props.coupon.endDate, 'YYYY-MM-DD', true)
				}
			})
	}

	componentDidUpdate() {
		const { loading, error, handleClose } = this.props;
		const { submitted } = this.state;

		if (submitted && !loading && !error)
			handleClose();
	}

	validate = () => {
		const { coupon } = this.state;
		const errors = {};
		console.log('[VALIDATE] coupon', coupon);
		if (!coupon.type)
			errors.typeError = "Must select a value";
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

	submit = () => {
		console.log(this.state.coupon.message);
		if (!this.props.loading) {
			if (this.validate()) {
				this.props.handleSave({
					...this.state.coupon,
					startDate: moment(this.state.coupon.startDate).format('YYYY-MM-DD'),
					endDate: moment(this.state.coupon.endDate).format('YYYY-MM-DD'),
					price: Math.round(this.state.coupon.price * 1e2) / 1e2,
					amount: ~~this.state.coupon.amount
				});
				this.setState({ submitted: true });
				setTimeout(() => this.setState({ submitted: false }), 3000);
			}
		}
	}


	handleChange = e => this.setState({ coupon: { ...this.state.coupon, [e.target.name]: e.target.value } });
	handleStartDateChance = date => this.setState({ coupon: { ...this.state.coupon, startDate: date } });
	handleEndDateChance = date => this.setState({ coupon: { ...this.state.coupon, endDate: date } });

	// handleStartDateChance = date => {
	// 	const nextDay = moment(date).add(1, 'days');
	// 	if (moment(this.state.coupon.endDate).isBefore(nextDay))
	// 		this.setState({ coupon: { ...this.state.coupon, startDate: date, endDate: nextDay } });
	// 	else
	// 		this.setState({ coupon: { ...this.state.coupon, startDate: date } });
	// }

	render() {
		const { loading, error, handleSave, handleClose, catagories } = this.props;
		const { coupon } = this.state;

		// console.log('[CouponEditForm] render() { coupon.type } => ', coupon.type);
		// console.log('[CouponEditForm] render() { catagories } => ', catagories);
		// console.log('[CouponEditForm] render() { startDate.format } => ', moment(coupon.startDate).format('YYYY-MM-DD'));
		// console.log('[CouponEditForm] render() { startDate } => ', coupon.startDate);
		const catagoryMenuItems = [<MenuItem key="first-Arg" value="" disabled>Select a catagory</MenuItem>];
		catagoryMenuItems.push(
			!catagories || !Object.keys(catagories) ? null :
				Object.keys(catagories).map(key => <MenuItem key={key} value={key.toUpperCase()}>{key}</MenuItem>)
		);

		// let catagoryMenuItems =
		//     !catagories || !Object.keys(catagories) ? <MenuItem key="first-Arg" value="" disabled>Select a catagory</MenuItem> :
		//         Object.keys(catagories).map(key => <MenuItem key={key} value={key}>{key}</MenuItem>)
		//             .unshift(<MenuItem key="first-Arg" value="" disabled>Select a catagory</MenuItem>);

		return !coupon ? null : (
			<Dialog
				open={coupon ? true : false}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Edit Coupon</DialogTitle>
				<DialogContent>
					{loading ?
						<div style={{ width: '550px' }}><Spinner /></div> : (
							<Ax>
								<TextField
									style={{ marginRight: '30px' }}
									name="id"
									hintText="Coupon ID"
									floatingLabelText="id"
									value={coupon.id}
									disabled
									// onChange={e => this.change(e)}
									// errorText={this.state.usernameError}
									floatingLabelFixed
								/>
								<TextField
									name="title"
									hintText="Coupon title"
									floatingLabelText="title"
									value={coupon.title}
									disabled
									// onChange={e => this.change(e)}
									// errorText={this.state.usernameError}
									floatingLabelFixed
								/>
								<Select
									style={{ marginTop: '10px' }}
									label={"Select a catagory"}
									value={coupon.type}
									onChange={this.handleChange}
									name="type"
									displayEmpty
									fullWidth
									className={classes.Select}
								>
									{catagoryMenuItems}
								</Select>
								<br />
								<br />
								<div className={classes.Date}>
									<div className={classes.Left}>
										<div style={{ margin: '400 30' }}>
											<Typography paragraph variant="subheading">Available since</Typography>
										</div>
									</div>
									<div className={classes.Right}>
										<Typography paragraph variant="subheading">Available until</Typography>
									</div>
								</div>
								<div className={classes.Dates}>
									<div className={classes.Left}>
										<DatePicker
											onChange={this.handleStartDateChance}
											selected={moment(coupon.startDate)}
											minDate={moment(coupon.startDate)}
											maxDate={moment(coupon.startDate)}
											inline
											disabled
										/>
									</div>
									<div className={classes.Right}>
										<DatePicker
											onChange={this.handleEndDateChance}
											selected={moment(coupon.endDate)}
											minDate={moment.max(moment().add(1, 'days'), moment(coupon.startDate).add(1, 'days'))}
											inline
										/>
									</div>
								</div>
								<TextField
									name="image"
									hintText="Enter image url"
									floatingLabelText="Image"
									value={coupon.image}
									onChange={this.handleChange}
									errorText={this.state.imageError}
									floatingLabelFixed
									fullWidth
								/>
								<br />

								<TextField
									style={{ marginRight: '30px' }}
									name="amount"
									floatingLabelText="Amount"
									placeholder="Coupons available (#)"
									type="number"
									value={coupon.amount}
									onChange={this.handleChange}
									errorText={this.state.amountError}
								/>

								<TextField
									name="price"
									floatingLabelText="Price"
									placeholder="Coupon price"
									type="number"
									value={coupon.price}
									onChange={this.handleChange}
									errorText={this.state.priceError}
									InputProps={{
										startAdornment: inputAdornment,
									}}
								/>
								<br />

								<TextField
									name="message"
									hintText="Please write a description"
									floatingLabelText="Description"
									value={coupon.message}
									onChange={this.handleChange}
									errorText={this.state.messageError}
									fullWidth
									multiLine={true}
									rowsMax={4}
								/>

								{error ? <Ax>   <h5>{error}</h5></Ax> : null}
								{/* image, amount, price, end, start DATE */}
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

// const mapStateToProps = state => {
//     return {
//         loading: state.coupons.editing,
//         error: state.coupons.editError
//     };
// };

// export default connect(mapStateToProps)(CouponEditForm);
export default CouponEditForm;