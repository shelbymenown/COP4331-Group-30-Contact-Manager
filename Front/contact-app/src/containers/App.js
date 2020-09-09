import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
// Container imports..
import ListedComponents from './ListedComponents/ListedComponents';
import Ax from '../hoc/Ax';
import Layout from '../components/Layout/Layout';
import Auth from './Auth/Auth';
import Cart from './Cart/Cart';
import AllCompanies from './AllCompanies/AllCompanies';
import CreateCoupon from './CreateCoupon/CreateCoupon';
import MyCoupons from './MyCoupons/MyCoupons';
import Income from './Income/Income';
// import "react-datepicker/dist/react-datepicker.css?raw";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import 'typeface-roboto';
import axios from 'axios';

injectTapEventPlugin();
axios.defaults.baseURL = 'http://localhost:8080/couponsystem/webapi/';
axios.defaults.withCredentials = true;

class App extends Component {
  render() {
    return (
      <Ax>
        <MuiThemeProvider>
          <Layout>
            {/*  */}
            <Switch>
              <Redirect exact from='/' to='/coupons' />
              <Route path='/auth' component={Auth} />
              <Route path='/cart' component={Cart} />
              {/* <Route path='/company/:id' component={CompanyProfile} /> */}
              <Route path='/income/' component={Income} />
              <Route path='/company/' component={AllCompanies} />
              <Route path='/coupons/my' component={MyCoupons} />
              <Route path='/coupons/create' component={CreateCoupon} />
              <Route path='/coupons' component={ListedComponents} />
              {/* <Redirect to='/coupons' /> */}
              {/* <Route path="/" component={} /> */}
            </Switch>
          </Layout>
        </MuiThemeProvider>
      </Ax>
    );
  }
}

export default App;
