import React, { Component } from 'react';
import { connect } from 'react-redux'
import classes from './Cards.css';
import CouponCard from './CouponCard/CouponCard';
import CouponDeleteForm from './CouponDeleteForm/CouponDeleteForm';
import CouponEditForm from './CouponEditFrom/CouponEditForm';
import Spinner from '../UI/Spinner/Spinner';
import Grid from '@material-ui/core/Grid';
import Ax from '../../hoc/Ax';
import * as actions from '../../store/actions/actions';
import * as userTypes from '../../store/userTypes';
import * as utils from '../../store/util';
import { Typography } from '@material-ui/core';

class Cards extends Component {

	state = {
		isEdit: false,
		formOpen: false,
		formCoupon: null
	};

	componentWillMount() {
		const { auth, catagories, filters, onMyCouponsMount } = this.props;

		this.updateStore(filters, catagories);

		if (auth && auth.type !== userTypes.ADMIN) {
			onMyCouponsMount(auth);
			// load/refresh myCoupons
		}
	}

	componentWillUpdate(nextProps, nextState) {
		const { catagories, filters } = nextProps;
		const { formCoupon } = nextState;

		console.log('[componentWillUpdate] nextState', nextState);

		if (!formCoupon) {
			let shouldUpdateStore = utils.getFilterParam(filters) !== utils.getFilterParam(this.props.filters);
			if (!shouldUpdateStore) {
				for (let key in catagories) {
					if (catagories[key] !== this.props.catagories[key]) {
						shouldUpdateStore = true;
						break;
					}
				}
			}

			// if (utils.getFilterParam(filters) !== utils.getFilterParam(this.props.filters)) {
			//     console.log('[Cards.js] componentWillUpdate() { nextState }', nextState);
			//     console.log('[Cards.js] componentWillUpdate() { nextProps }', nextProps);
			//     console.log('[Cards.js] componentWillUpdate() { this.state }', this.state);
			//     console.log('[Cards.js] componentWillUpdate() { this.props }', this.props);
			// }

			console.log('shouldUpdateStore ? ', shouldUpdateStore);
			if (shouldUpdateStore)
				this.updateStore(filters, catagories);
		}
	}

	updateStore = (filters, catagories) => {
		const { onCouponsMount, onCouponsArchivedMount } = this.props;

		if (filters.all)
			onCouponsMount({ type: utils.getCatagaroyTypeSearchParams(catagories) }, true);
		// setTimeout(onCouponsArchivedMount({ type: utils.getCatagaroyTypeSearchParams(catagories) }), 2500);
		else if (filters.new)
			onCouponsMount({ type: utils.getCatagaroyTypeSearchParams(catagories) });
		else if (filters.archived)
			onCouponsArchivedMount({ type: utils.getCatagaroyTypeSearchParams(catagories) });
	}

	isAddable = (c) => {
		const { auth, cart, purchasing, myCoupons } = this.props;

		if (purchasing)
			return false;

		if (!auth || !auth.type)
			return false;

		if (auth.type === userTypes.ADMIN || auth.type === userTypes.COMPANY)
			return false;

		for (let key in myCoupons) {
			if (myCoupons[key].id === c.id)
				return false;
		}

		if (c.id in cart)
			return false;

		return true;
		// if !auth => return true, set link to sign up.
		// if auth.userType = ADMIN || COMPANY return false;
		// ELSE ->
		// if c.id in myCoupons || cart return false;
		// ELSE ->
		// return true;
	}
	isManageable = (c) => {
		const { auth, myCoupons } = this.props;

		if (!auth || !auth.type)
			return false;

		if (auth.type === userTypes.CUSTOMER)
			return false;

		if (auth.type === userTypes.ADMIN)
			return true;

		if (auth.type === userTypes.COMPANY) {
			for (let key in myCoupons) {
				if (myCoupons[key].id === c.id)
					return true;
			}
		}

		return false;
		// if !auth return false;
		// ELSE ->
		// IF auth.userType = CUSTOMER return false;
		// ELSE ->
		// if auth.userType = admin return true;
		// ELSE ->
		// if c.id in myCoupons return true;
		// ELSE ->
		// return false;
	}

	couponCards = () => {
		const { filters, loading, error, coupons } = this.props;
		return !filters || !(filters.all || filters.new) || loading || error || !coupons || coupons.length < 1 ?
			null :
			<Ax>
				{coupons.map(c =>
					<Grid item xs key={c.id}>
						<CouponCard
							coupon={c}
							addAble={this.isAddable(c)}
							manageAble={this.isManageable(c)}
							add={() => this.handleAddToCart(c)}
							edit={() => this.handleEdit(c)}
							remove={() => this.handelRemove(c)}
						/>
					</Grid>
				)}
			</Ax>
	}

	couponArchivedCards = () => {
		const { filters, loading, error, archivedCoupons } = this.props;

		return !filters || !(filters.all || filters.archived) || loading || error || !archivedCoupons || archivedCoupons.length < 1 ?
			null :
			<Ax>

				{archivedCoupons.map((c, i) =>
					<Grid item xs
						key={
							'archived_' + c.id + '_' + i
							// 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, () => {
							//     let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
							//     return v.toString(16)
							// })
						}>
						<CouponCard
							coupon={c}
							addAble={false}
							manageAble={false}
						/>
					</Grid>
				)}
			</Ax>

	}
	handleAddToCart = coupon => {
		// dispatch add to cart..
		const { auth, onAddToCart } = this.props;
		onAddToCart(auth, coupon);
	}

	handleEdit = coupon => this.setState({ isEdit: true, isOpen: true, formCoupon: coupon });
	handleEditClose = () => this.setState({ isOpen: false, formCoupon: null });
	handleEditSave = coupon => this.props.onCouponEdit(this.props.auth, coupon);

	handelRemove = coupon => this.setState({ isEdit: false, isOpen: true, formCoupon: coupon });
	handleRemoveClose = () => this.setState({ isOpen: false, formCoupon: null });
	handleRemoveConfirm = coupon => this.props.onCouponDelete(this.props.auth, coupon);

	render() {
		// console.log(this.props.coupons);
		let couponCards = this.couponCards(), couponArchivedCards = this.couponArchivedCards(),
			finalError = this.props.error || (couponCards ? null : this.props.archivedError),
			finalLoading = this.props.loading || this.props.archivedLoading;
		console.log(couponArchivedCards);
		return (
			<div className={classes.Cards} >
				{finalError ? <h1>{finalError}</h1> : null}
				{finalLoading ? <Spinner /> :
					<Grid container style={{ padding: '20px', textAlign: 'center' }} spaceing={24}>
						{couponCards}
						{this.props.filters.all && couponArchivedCards ? 
							<div style={{ paddingBottom: '50px', paddingTop: '40px', width: '100%' }}>
								<div style={{ width: '100%', height: '20px', borderBottom: '1px solid black', textAlign: 'center' }}>
									<span style={{ fontSize: '40px', backgroundColor: '#F3F5F6', padding: '0 10px' }}>
										Archived
                                    </span>
								</div>
							</div> : null
						}
						{couponArchivedCards}
					</Grid>
				}
				{!this.state.isOpen ? null :
					this.state.isEdit ?
						<CouponEditForm
							coupon={this.state.formCoupon}
							catagories={this.props.catagories}
							handleSave={this.handleEditSave}
							handleClose={this.handleEditClose}
							loading={this.props.editing}
							error={this.props.editError}
						/>
						: // (REMOVE FORM)
						<CouponDeleteForm
							coupon={this.state.formCoupon}
							handleDelete={this.handleRemoveConfirm}
							handleClose={this.handleRemoveClose}
							loading={this.props.deleting}
							error={this.props.deleteError}
						/>
				}
			</div >
		);
	}
}

const mapStateToProps = state => {
	return {
		catagories: state.catagory.catagories,
		cart: state.cart.cart,
		purchasing: state.cart.purchasing,
		filters: state.filter,
		coupons: state.coupons.coupons,
		archivedCoupons: state.coupons.archivedCoupons,
		myCoupons: state.myCoupons.coupons,
		editing: state.coupons.editing,
		deleting: state.coupons.deleting,
		loading: state.coupons.loading,
		archivedLoading: state.coupons.archivedLoading,
		editError: state.coupons.editError,
		deleteError: state.coupons.deleteError,
		archivedError: state.coupons.archivedError,
		error: state.coupons.error,
		auth: state.auth.user
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onCouponsMount: (params, isAll) => dispatch(actions.loadCoupons(params, isAll)),
		onCouponsArchivedMount: params => dispatch(actions.loadCouponsArchived(params)),
		onMyCouponsMount: authData => dispatch(actions.loadMyCoupons(authData)),
		onCouponEdit: (authData, coupon) => dispatch(actions.editCoupon(authData, coupon)),
		onCouponDelete: (authData, coupon) => dispatch(actions.deleteCoupon(authData, coupon)),
		onAddToCart: (authData, coupon) => dispatch(actions.addItem(authData, coupon))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Cards);