import React, { Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';
import Ax from '../../../hoc/Ax';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card/Card';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LinearProgress from '@material-ui/core/LinearProgress';
import { CardContent, CardActions, Typography } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import Classes from './CouponCard.css';

const transformText = text => text && typeof text === 'string' ? text[0].toUpperCase() + text.substring(1).toLowerCase() : '';

const styles = theme => ({
    card: {
        maxWidth: 400,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    }
});

class CouponCard extends Component {
    state = {
        expanded: false,
        loadingAmount: false,
        amountLeft: null,
        amountLeftError: null
    };

    handleExpandClick = () => {
        this.setState({ expanded: !this.state.expanded });
        if (!this.state.amountLeft && !this.state.amountLeftError && this.props.coupon && this.props.coupon.id > 0)
            this.getAmountLeft();
    }

    getAmountLeft = () => {
        const { coupon } = this.props;
        this.setState({ loadingAmount: true });
        axios.get('/coupons/' + coupon.id + '/amountInStock')
            .then(res => {
                console.log('[CouponCard.js] getAmountLeft() => ', res.data);
                this.setState({ amountLeft: res.data.inStock, loadingAmount: false, amountLeftError: null });
            })
            .catch(err => {
                console.log(err);
                this.setState({ amountLeft: null, loadingAmount: false, amountLeftError: err.message });
            })
    }

    render() {
        const { classes } = this.props,
            endDate = moment(this.props.coupon.endDate, 'YYYY-MM-DD', true).format('L'),
            startDate = moment(this.props.coupon.startDate, 'YYYY-MM-DD', true).format('L');
        return (
            <div className={Classes.Coupon}>
                <Card style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', minWidth: '260px', maxWidth: '400px' }}>
                    <CardHeader title={this.props.coupon.title}
                        subheader={<Ax><b>Good until:</b> {endDate}</Ax>}>
                    </CardHeader>

                    <CardMedia
                        className={classes.media}
                        image="https://as.ftcdn.net/r/v1/pics/ea2e0032c156b2d3b52fa9a05fe30dedcb0c47e3/landing/images_photos.jpg"
                        title="Placeholder Image"
                    />
                    <CardActions className={classes.actions} disableActionSpacing>
                        <IconButton
                            className={classnames(classes.expand, {
                                [classes.expandOpen]: this.state.expanded,
                            })}
                            onClick={this.handleExpandClick}
                            aria-expanded={this.state.expanded}
                            aria-label="Show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </CardActions>
                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph variant="display1">
                                {this.props.coupon.title}
                            </Typography>
                            <div style={{ textAlign: 'left', borderRadius: '2px', borderBottom: '1px solid #eee' }}>
                                <Typography paragraph>
                                    <b>Available since:</b> {startDate}
                                </Typography>
                                <Typography paragraph>
                                    <b>Available until:</b> {endDate}
                                </Typography>
                                <Typography paragraph>
                                    <b>Catagory:</b> <Chip label={transformText(this.props.coupon.type)} />
                                </Typography>
                                <Typography paragraph>
                                    <b>Price:</b> {this.props.coupon.price}$
                                </Typography>
                                {
                                    this.state.loadingAmount ?
                                        <div style={{ paddingTop: '3px', paddingBottom: '20px' }}>
                                            <LinearProgress variant="query" />
                                        </div> :
                                        !this.state.amountLeft ? null :
                                            this.state.amountLeft < 0 ?
                                                <Typography paragraph variant="caption">
                                                    OUT OF STOCK
                                                </Typography> :
                                                <Typography paragraph variant="caption">
                                                    {this.state.amountLeft} coupon(s) left
                                                </Typography>
                                }
                            </div>
                        </CardContent>
                        <CardContent>
                            <Typography style={{ textAlign: 'left' }} paragraph variant="subheading">
                                Details
                            </Typography>
                            <Typography paragraph>
                                {this.props.coupon.message}
                            </Typography>
                        </CardContent>
                    </Collapse>
                    <CardActions>
                        <div style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', display: 'block' }}>
                            <Button
                                variant="fab"
                                disabled={!this.props.addAble || !(!this.state.amountLeft ? true : this.state.amountLeft > 0)}
                                color="primary"
                                aria-label="add"
                                onClick={this.props.add}>
                                <AddIcon />
                            </Button>
                            <Button
                                style={{ padding: '5px' }}
                                variant="fab"
                                disabled={!this.props.manageAble}
                                color="primary"
                                aria-label="edit"
                                onClick={this.props.edit}>
                                <EditIcon />
                            </Button>
                            <Button
                                style={{ padding: '5px' }}
                                variant="fab"
                                disabled={!this.props.manageAble}
                                color="secondary"
                                aria-label="delete"
                                onClick={this.props.remove}>
                                <DeleteIcon />
                            </Button>
                        </div>
                    </CardActions>

                </Card>
            </div >
        );
    }
}

export default withStyles(styles)(CouponCard);



