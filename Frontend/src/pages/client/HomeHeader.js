// HomeHeader.js

import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./HomeHeader.scss";
import * as actions from "../../store/actions";

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: ""
        };
    }

    handleLogin = () => {
        this.props.history.push("/login");
    };

    handleLogout = () => {
        this.props.processLogout();
        this.props.history.push("/home");
    };

    handleOnChangeSearch = (event) => {
        this.setState({
            keyword: event.target.value
        });
    };

    handleSearch = () => {
        const { keyword } = this.state;

        if (!keyword.trim()) return;

        this.props.history.push(
            `/search?keyword=${keyword}`
        );
    };

    render() {
        const { isLoggedIn, userInfor } = this.props;

        return (
            <div className="home-header-container">
                <div className="home-header-content">

                    {/* TOP HEADER */}
                    <div className="top-header">
                        <div className="left-content">
                            <h2>Booking Hotel</h2>
                        </div>

                        <div className="right-content">
                            {isLoggedIn ? (
                                <div className="user-login">
                                    <span>
                                        Xin chào, {userInfor?.name || "User"}
                                    </span>

                                    <button
                                        className="logout-btn"
                                        onClick={this.handleLogout}
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="user-not-login"
                                    onClick={this.handleLogin}
                                >
                                    Đăng nhập / Đăng ký
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MENU */}
                    <div className="center-content">
                        <ul>
                            <li onClick={() => this.props.history.push("/home")}>
                                Trang chủ
                            </li>

                            <li onClick={() => this.props.history.push("/hotels")}>
                                Khách sạn
                            </li>

                            {isLoggedIn && (
                                <li onClick={() => this.props.history.push("/my-bookings")}>
                                    Đơn đặt phòng
                                </li>
                            )}

                            <li onClick={() => this.props.history.push("/contact")}>
                                Liên hệ
                            </li>
                        </ul>
                    </div>

                    {/* SEARCH BOX */}
                    <div className="search-box">
                        <div className="search-item large">
                            <input
                                type="text"
                                placeholder="Bạn muốn đến đâu?"
                                value={this.state.keyword}
                                onChange={this.handleOnChangeSearch}
                            />
                        </div>

                        {/* <div className="search-item">
                            <span>Nhận phòng — Trả phòng</span>
                        </div> */}

                        <button
                            className="search-button"
                            onClick={this.handleSearch}
                        >
                            Tìm kiếm
                        </button>
                    </div>

                </div>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfor: state.user.userInfor
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout())
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(HomeHeader)
);
