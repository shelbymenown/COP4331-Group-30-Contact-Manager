import React, { Component } from 'react';
import classes from './ListedComponents.css';
import FilterBar from '../../components/FilterBar/FilterBar';
import Cards from '../../components/Cards/Cards';


// Add switch and route inside the container.
class ListedComponents extends Component {
    render() {
        return (
            <div className={classes.Container}>
                <FilterBar />
                <Cards />
            </div>
        );
    }
}

export default ListedComponents;