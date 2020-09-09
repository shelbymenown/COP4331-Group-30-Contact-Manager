import React from 'react';
import Button from '@material-ui/core/Button';
import classes from './BundledButtons.css';

const bundledButtons = props => (
    <div className={classes.BundledButtons}>
        {
            Object.entries(props.buttons).map(([key, value]) => {
                if (value)
                    return <Button key={key} variant='contained' color='primary'>{key}</Button>;
                else
                    return <Button key={key} variant='outlined' color='primary' onClick={() => props.clicked(key)}>{key}</Button>;
            })
        }
    </div>
);
export default bundledButtons;