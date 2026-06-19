import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import HotelManage from '../pages/System/HotelManage';
import BookingManage from '../pages/System/BookingManage';
import UserManage from '../pages/System/UserManage';
import Dashboard from '../pages/System/Dashboard';
import RoomManage from '../pages/System/RoomManage';

class System extends Component {
    render() {
        const { systemMenuPath } = this.props;
        return (
            <div className="system-container">
                <div className="system-list">
                    <Switch>
                        <Route
                            path="/system/dashboard"
                            component={Dashboard}
                        />

                        {/* Quản lý người dùng */}
                        <Route
                            path="/system/user-manage"
                            component={UserManage}
                        />

                        {/* Quản lý khách sạn */}
                        <Route
                            path="/system/hotel-manage"
                            component={HotelManage}
                        />
                        <Route
                            path="/system/room-manage"
                            component={RoomManage}
                        />

                        {/* Quản lý booking */}
                        <Route
                            path="/system/booking-manage"
                            component={BookingManage}
                        />

                        

                        {/* Redirect mặc định */}
                        <Route
                            component={() => {
                                return (
                                    <Redirect to="/system/dashboard" />
                                )
                            }}
                        />

                    </Switch>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
