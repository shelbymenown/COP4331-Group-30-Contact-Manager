import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from './FilterBar.css';
import BundledButtons from './BundledButtons/BundledButtons';
import FilterSection from './FilterSection/FilterSection';
import * as actions from '../../store/actions/actions';

// Tags sellections
// Add button
// Chips of selected tags.
// ArchivedSel

class FilterBar extends Component {
    componentDidMount() {
        this.props.onCatagoryMount();
    }

    render() {
        // console.log(this.props.tags);
        return (
            <div className={classes.FilterBar}>
                <FilterSection tags={this.props.tags} toggle={this.props.onCatagoryToggle} reset={this.props.onCatagoryReset} />
                <BundledButtons clicked={this.props.onFilterSelect} buttons={this.props.filters} />
            </div>
        );
    }
}


// mapStateToProps = state => {
// STATE OF SELECTED BUTTON
// STATE OF SELECTED TAGS
// };

const mapStateToProps = state => {
    return {
        filters: state.filter,
        tags: state.catagory.catagories,
        loading: state.catagory.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onCatagoryMount: () => dispatch(actions.loadCatagory()),
        onCatagoryToggle: catagory => dispatch(actions.toggleCatagory(catagory)),
        onCatagoryReset: () => dispatch(actions.resetCatagory()),
        onFilterSelect: filter => dispatch(actions.selectFilter(filter))
    };
};

// export default connect(mapStateToProps, mapDispatchToProps)(filterBar);
export default connect(mapStateToProps, mapDispatchToProps)(FilterBar);