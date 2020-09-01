import React, { Component } from 'react';

import classes from './ErrorModal.css';
import Ax from '../../../../hoc/Ax';
import Backdrop from '../../Backdrop/Backdrop';
import Button from '../../../UI/Button/Button';

class Modal extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    }

    render() {
        const btnType = this.props.btnType && 
            (this.props.btnType === "Danger" || this.props.btnType === "Success") ?
            this.props.btnType : "Danger";

        return (
            <Ax>
                <Backdrop show={this.props.show} close={this.props.closeModal} />
                <div
                    className={classes.Modal}
                    onKeyPress={this.props.keyPressed}
                    style={this.props.show ?
                        { transform: 'translateY(0)', opacity: 1 } :
                        { transform: 'translateY(-100vh)', opacity: '0' }
                    }>
                    {this.props.children}
                    <br />
                    <Button className={classes.Button}
                        btnType={btnType} 
                        clicked={this.props.btnOnClick ? this.props.btnOnClick : this.props.closeModal}>
                        {this.props.btnLbl ? this.props.btnLbl : 'Close'}
                    </Button>
                </div>
            </Ax>
        );
    }
}

export default Modal;