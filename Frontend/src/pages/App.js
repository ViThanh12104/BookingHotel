import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import {
    userIsAuthenticated,
    userIsNotAuthenticated,
    userIsAdmin
} from '../hoc/authentication.js';

import { path } from '../utils/index.js';

import Login from './Auth/Login.js';
import System from '../routes/System.js';
import HomePage from './client/HomePage/HomePage.js';
import HotelListPage from './client/HotelListPage/HotelListPage.js';
import HotelDetailPage from './client/HotelListPage/HotelDetailPage.js';
import AllHotelListPage from './client/HotelListPage/AllHotelListPage.js';
import MyBookingPage from './client/Booking/MyBookingPage';
import SearchPage from './client/Search/SearchPage.js'

import '@fortawesome/fontawesome-free/css/all.min.css';
import { CustomToastCloseButton } from '../components/CustomToast.js';

class App extends Component {

    renderHomeRoute = () => {
        const { isLoggedIn, userInfor } = this.props;

        if (!isLoggedIn) {
            return <HomePage />;
        }

        if (userInfor && userInfor.role === 'admin') {
            return <Redirect to={path.SYSTEM} />;
        }

        return <HomePage />;
    };

    render() {
        return (
            <Fragment>
                <BrowserRouter>
                    <div className="main-container">
                        <div className="content-container">

                            <Switch>

                                <Route
                                    path={path.HOME}
                                    exact
                                    render={this.renderHomeRoute}
                                />

                                <Route
                                    path="/hotels-city"
                                    exact
                                    component={HotelListPage}
                                />

                                <Route
                                    path="/hotels"
                                    exact
                                    component={AllHotelListPage}
                                />

                                <Route
                                    path="/hotel-detail/:id"
                                    exact
                                    component={HotelDetailPage}
                                />

                                <Route
                                    path="/my-bookings"
                                    component={userIsAuthenticated(MyBookingPage)}
                                />
                                
                                <Route
                                    path="/search"
                                    exact
                                    component={SearchPage}
                                />

                                <Route
                                    path={path.LOGIN}
                                    exact
                                    component={userIsNotAuthenticated(Login)}
                                />

                                <Route
                                    path={path.SYSTEM}
                                    component={userIsAdmin(System)}
                                />



                                <Route
                                    render={() => <Redirect to={path.HOME} />}
                                />

                            </Switch>

                        </div>

                        <ToastContainer
                            className="toast-container"
                            toastClassName="toast-item"
                            bodyClassName="toast-item-body"
                            autoClose={false}
                            hideProgressBar={true}
                            pauseOnHover={false}
                            pauseOnFocusLoss={true}
                            closeOnClick={false}
                            draggable={false}
                            closeButton={<CustomToastCloseButton />}
                        />
                    </div>
                </BrowserRouter>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    started: state.app.started,
    isLoggedIn: state.user.isLoggedIn,
    userInfor: state.user.userInfor
});

export default connect(mapStateToProps)(App);