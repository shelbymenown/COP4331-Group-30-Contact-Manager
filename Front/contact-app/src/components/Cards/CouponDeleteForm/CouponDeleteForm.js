import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Ax from '../../../hoc/Ax';
import Spinner from '../../UI/Spinner/Spinner';
import classes from './CouponDeleteForm.css'

class CouponDeleteForm extends Component {

    state = {
        submitted: false
    }

    submit = () => {
        if (!this.props.loading) {
            this.props.handleDelete(this.props.coupon);
            this.setState({ submitted: true });
            setTimeout(() => this.setState({ submitted: false }), 3000);
        }
    }
    render() {
        const { coupon, loading, error, handleDelete, handleClose } = this.props;

        if (this.state.submitted && !loading && !error)
            handleClose();

        return !coupon ? null : (
            <Ax>
                <Dialog
                    open={true}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Remove coupon</DialogTitle>

                    <DialogContent>
                        {loading ?
                            <div style={{ width: '550px' }}><Spinner /></div>
                            :
                            <Ax>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to remove coupon <b>{coupon.title}</b>?
                                    <p>This will permanently remove the coupon from the databse</p>
                                </DialogContentText>
                                {error ? <h5>{error}</h5> : null}
                            </Ax>
                        }
                    </DialogContent>

                    <DialogActions>
                        <DialogActions>
                            <RaisedButton onClick={handleClose} label='Cancel' primary style={{ margin: '7px 10px' }} />
                            <RaisedButton onClick={this.submit} label='Remove' secondary style={{ margin: '7px 10px' }} />
                        </DialogActions>
                    </DialogActions>
                </Dialog>
            </Ax>
        );
    }
}



export default CouponDeleteForm;