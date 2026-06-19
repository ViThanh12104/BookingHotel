import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class Home extends Component {
    render() {
        const { isLoggedIn, userInfor } = this.props;

        let linkToRedirect = '/home';

        // Chưa đăng nhập → về trang chủ client
        if (!isLoggedIn) {
            linkToRedirect = '/home';
        } 
        // Đã đăng nhập → kiểm tra role
        else {
            if (userInfor && userInfor.role === 'admin') {
                // Admin → vào trang quản trị
                linkToRedirect = '/system/user-manage';
            } else {
                // Customer → vẫn ở trang chủ client
                linkToRedirect = '/home';
            }
        }

        return <Redirect to={linkToRedirect} />;
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfor: state.user.userInfor
    };
};

export default connect(mapStateToProps)(Home);