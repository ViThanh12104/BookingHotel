import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from "../../store/actions";
import './Login.scss';
import Swal from 'sweetalert2'

import userService from '../../services/userService';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            isShowPassword: false,
            errMessage: '',
            isRegister: false
        }
    }

    handleOnChangeUser = (event) => {
        this.setState({
            email: event.target.value,
        })
    }
    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value,
        })
    }


    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })
        try {
            let data = await userService.handleLogin(this.state.email, this.state.password)
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })

            }
            if (data && data.errCode === 0) {
                localStorage.setItem("accessToken", data.token);
                localStorage.setItem("user", JSON.stringify(data.userData));

                this.props.userLoginSuccess(data.userData, data.token);

                if (data.userData.role === "admin") {
                    this.props.history.push("/system");
                } else {
                    this.props.history.push("/home");
                }
            }

        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }

        }

    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }
    handleOnChangeFullName = (event) => {
        this.setState({
            name: event.target.value
        })
    }

    handleOnChangeConfirmPassword = (event) => {
        this.setState({
            confirmPassword: event.target.value
        })
    }
    handleRegister = async () => {
    this.setState({
        errMessage: ''
    })

    if (this.state.password !== this.state.confirmPassword) {

        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Mật khẩu không khớp!',
            confirmButtonColor: '#f0ad4e'
        })

        return;
    }

    try {

        let data = await userService.handleRegister({
            email: this.state.email,
            password: this.state.password,
            name: this.state.name
        });

        if (data && data.errCode !== 0) {

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message,
                confirmButtonColor: '#d33'
            })

        }

        if (data && data.errCode === 0) {

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Đăng ký thành công!',
                confirmButtonColor: '#3085d6'
            })

            this.setState({
                isRegister: false,
                password: '',
                confirmPassword: '',
                name: '',
                email: '',
                errMessage: ''
            })
        }

    } catch (error) {

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Đăng ký thất bại!',
            confirmButtonColor: '#d33'
        })

    }
}

    render() {
        //jsx

        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content row'>
                        <div className='col-12 text-center text-login'>
                            {this.state.isRegister ? 'Register' : 'Login'}
                        </div>
                        <div className='col-12 form-group login-input'>
                            {
                                this.state.isRegister &&
                                <div className='col-12 form-group login-input'>
                                    <label>Name:</label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        placeholder='Enter your name'
                                        value={this.state.name}
                                        onChange={(event) => this.handleOnChangeFullName(event)}
                                    />
                                </div>
                            }
                            <label>Email:</label>
                            <input type='email'
                                className='form-control'
                                placeholder='Enter your email'
                                value={this.state.email}
                                onChange={(event) => this.handleOnChangeUser(event)}
                            />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Password:</label>
                            <div className='custom-input-password'>
                                <input type={this.state.isShowPassword ? 'text' : 'password'}
                                    className='form-control'
                                    placeholder='Enter your password'
                                    value={this.state.password}
                                    onChange={(event) => this.handleOnChangePassword(event)}
                                />
                                <span onClick={() => { this.handleShowHidePassword() }}>
                                    <i
                                        className={
                                            this.state.isShowPassword
                                                ? 'fa-solid fa-eye'
                                                : 'fa-solid fa-eye-slash'
                                        }
                                    ></i>
                                </span>
                                {
                                    this.state.isRegister &&
                                    <div className='col-12 form-group login-input'>
                                        <label>Confirm Password:</label>
                                        <input
                                            type='password'
                                            className='form-control'
                                            placeholder='Confirm password'
                                            value={this.state.confirmPassword}
                                            onChange={(event) => this.handleOnChangeConfirmPassword(event)}
                                        />

                                    </div>
                                }

                            </div>

                        </div>
                        <div className='col-12' style={{ color: 'red' }}>
                            {this.state.errMessage}
                        </div>
                        <div className='col-12 form-group'>
                            <button
                                className='btn-login'
                                onClick={() => {
                                    this.state.isRegister
                                        ? this.handleRegister()
                                        : this.handleLogin()
                                }}
                            >
                                {this.state.isRegister ? 'Register' : 'Login'}
                            </button>
                        </div>
                        <div className='col-12 text-center mt-3'>
                            {
                                this.state.isRegister
                                    ? (
                                        <span>
                                            Already have an account?
                                            <span
                                                style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
                                                onClick={() => this.setState({ isRegister: false })}
                                            >
                                                Login
                                            </span>
                                        </span>
                                    )
                                    : (
                                        <span>
                                            Don't have an account?
                                            <span
                                                style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
                                                onClick={() => this.setState({ isRegister: true })}
                                            >
                                                Register
                                            </span>
                                        </span>
                                    )
                            }
                        </div>
                        <div className='col-12'>
                            <span className='forgotpw'>Forgot your password?</span>
                        </div>
                        <div className='col-12 text-center mt-3'>
                            <span>Or Login with:</span>
                        </div>
                        <div className='col-12 social-login'>
                            <i className="fa-brands fa-google google"></i>
                            <i className="fab fa-facebook-f facebook"></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    language: state.app.language
});

const mapDispatchToProps = dispatch => ({
    userLoginSuccess: (userInfor, token) => dispatch(actions.userLoginSuccess(userInfor, token))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));