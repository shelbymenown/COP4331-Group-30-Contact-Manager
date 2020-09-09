import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import SuccessIcone from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
// import Spinner from '../../UI/Spinner/Spinner';
import Ax from '../../../hoc/Ax';

import DateIcon from '@material-ui/icons/DateRange';
import DescriptionIcon from '@material-ui/icons/Description';
import ImageIcon from '@material-ui/icons/Image';
import * as utils from '../../../store/util';
import classes from './CouponItem.css';
import { Typography } from 'material-ui/styles/typography';

const theme = createMuiTheme({
    palette: {
        primary: green,
        secondary: red
    },
});

const couponItem = props => {
    const { coupon, divider, clicked, remove, collapsedInfo, collapseItem, purchased, loading, error, key } = props;
    // console.log('[couponItem] render() props', props)
    return !coupon ? null : (
        <Collapse key={key} in={collapseItem} timeout='auto' unmountOnExit>
            <MuiThemeProvider theme={theme}>
                {loading && !purchased ?
                    <div style={{ paddingTop: '28px', paddingBottom: '28px' }}>
                        <LinearProgress variant="query" />
                    </div> :
                    <Ax>
                        <ListItem component={Link} to={'/coupon/' + coupon.id} button divider={divider && !purchased && !error && !collapsedInfo} onClick={e => clicked(e, coupon.id)}>
                            <ListItemAvatar>
                                <Avatar style={{ backgroundColor: utils.stringToColor(coupon.title) }}>
                                    {coupon.title ? coupon.title[0].toUpperCase() : null}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={coupon.title}
                                secondary={coupon.type}
                            />
                            <ListItemSecondaryAction>
                                <IconButton aria-label="Delete" onClick={() => remove(coupon.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Collapse in={purchased} timeout='auto' unmountOnExit>
                            <ListItem divider={divider && !collapsedInfo} component='div'>
                                <div style={{ marginLeft: '80px', display: 'inline-block' }} />
                                <ListItemIcon>
                                    <SuccessIcone color='primary' />
                                </ListItemIcon>
                                <div style={{ paddingRight: '-40px' }}>
                                    <ListItemText
                                        primary={'Successfuly purchased!'}
                                        primaryTypographyProps={{ color: 'primary' }}
                                    />
                                </div>
                            </ListItem>
                        </Collapse>
                        <Collapse in={error && !purchased} timeout='auto' unmountOnExit>
                            <ListItem divider={divider && !collapsedInfo && !purchased} component='div'>
                                <div style={{ marginLeft: '80px', display: 'inline-block' }} />
                                <ListItemIcon>
                                    <ErrorIcon color='secondary' />
                                </ListItemIcon>
                                <div style={{ paddingRight: '-40px' }}>
                                    <ListItemText
                                        primary={error}
                                        primaryTypographyProps={{ color: 'secondary' }}
                                    />
                                </div>
                            </ListItem>
                        </Collapse>
                        <Collapse in={collapsedInfo} timeout='auto' unmountOnExit>
                            <ListItem button component='div'>
                                <div className={classes.Nested} />
                                <ListItemIcon>
                                    <DateIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Until ' + moment(coupon.endDate, 'YYYY-MM-DD', true).format('L')} secondary={'Since ' + moment(coupon.startDate, 'YYYY-MM-DD', true).format('L')} />
                            </ListItem>
                            <ListItem button component='div'>
                                <div className={classes.Nested} />
                                <ListItemIcon>
                                    <ImageIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Image'} secondary={coupon.image} />
                            </ListItem>
                            <ListItem button component='div'>
                                <div className={classes.Nested} />
                                <ListItemAvatar>
                                    <Avatar style={{ backgroundColor: '#778899' }}>#</Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={'Amount left'} secondary={coupon.amount} />
                            </ListItem>
                            <ListItem button component='div'>
                                <div className={classes.Nested} />
                                <ListItemAvatar>
                                    <Avatar style={{ backgroundColor: '#adb7c1' }}>$</Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={'Price'} secondary={coupon.price + "$"} />
                            </ListItem>
                            <ListItem button divider={divider} component='div'>
                                <div className={classes.Nested} />
                                <ListItemIcon>
                                    <DescriptionIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Description'} secondary={coupon.message} />
                            </ListItem>
                        </Collapse>
                    </Ax>
                }
            </MuiThemeProvider>
        </Collapse >
    );
};

export default couponItem;