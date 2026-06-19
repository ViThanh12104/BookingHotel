import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as actions from "../../store/actions";

import './Header.scss';

class Header extends Component {

    render() {

        const { processLogout } = this.props;

        return (

            <div className="admin-sidebar">

                {/* LOGO */}
                <div className="admin-logo">
                    QUẢN LÝ KHÁCH SẠN
                </div>

                {/* MENU */}
                <div className="admin-nav">

                    <NavLink
                        to="/system/dashboard"
                        className="nav-item"
                        activeClassName="active"
                    >
                        <i className="fas fa-chart-line"></i>
                        <span>Bảng điều khiển</span>
                    </NavLink>

                    <NavLink
                        to="/system/user-manage"
                        className="nav-item"
                        activeClassName="active"
                    >
                        <i className="fas fa-users"></i>
                        <span>Quản lý người dùng</span>
                    </NavLink>

                    <NavLink
                        to="/system/hotel-manage"
                        className="nav-item"
                        activeClassName="active"
                    >
                        <i className="fas fa-hotel"></i>
                        <span>Quản lý khách sạn</span>
                    </NavLink>

                    <NavLink
                        to="/system/room-manage"
                        className="nav-item"
                        activeClassName="active"
                    >
                        <i className="fas fa-bed"></i>
                        <span>Quản lý phòng</span>
                    </NavLink>

                    <NavLink
                        to="/system/booking-manage"
                        className="nav-item"
                        activeClassName="active"
                    >
                        <i className="fas fa-calendar-check"></i>
                        <span>Quản lý đặt phòng</span>
                    </NavLink>

                </div>

                {/* LOGOUT */}
                <div
                    className="admin-logout"
                    onClick={processLogout}
                >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Đăng xuất</span>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);