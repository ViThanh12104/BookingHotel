import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

export const userIsAuthenticated = (WrappedComponent) => {
    class AuthenticatedComponent extends React.Component {
        render() {
            const { isLoggedIn } = this.props;
            return isLoggedIn
                ? <WrappedComponent {...this.props} />
                : <Redirect to="/login" />;
        }
    }

    const mapStateToProps = state => ({
        isLoggedIn: state.user.isLoggedIn
    });

    return connect(mapStateToProps)(AuthenticatedComponent);
};

export const userIsAdmin = (WrappedComponent) => {
    class AdminComponent extends React.Component {
        render() {
            const { isLoggedIn, userInfor } = this.props;
            const role = (userInfor?.role || '').toLowerCase();

            if (!isLoggedIn) {
                return <Redirect to="/login" />;
            }

            if (role !== 'admin') {
                return <Redirect to="/" />;
            }

            return <WrappedComponent {...this.props} />;
        }
    }

    const mapStateToProps = state => ({
        isLoggedIn: state.user.isLoggedIn,
        userInfor: state.user.userInfor
    });

    return connect(mapStateToProps)(AdminComponent);
};

export const userIsNotAuthenticated = (WrappedComponent) => {
    class NotAuthenticatedComponent extends React.Component {
        render() {
            const { isLoggedIn } = this.props;
            return !isLoggedIn
                ? <WrappedComponent {...this.props} />
                : <Redirect to="/" />;
        }
    }

    const mapStateToProps = state => ({
        isLoggedIn: state.user.isLoggedIn
    });

    return connect(mapStateToProps)(NotAuthenticatedComponent);
};