import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss'
import userService from '../../services/userService'
import { bind, set } from 'lodash';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';

import Header from '../../components/Header/Header'

import Swal from 'sweetalert2';

class UserManage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenEditUser: false,
            userEdit: {}
        }
    }

    async componentDidMount() {
        await this.getAllUsersFromReact()

    }

    handleAddnewUser = () => {
        this.setState({
            isOpenModalUser: true
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }
    toggleEditUser = () => {
        this.setState({
            isOpenEditUser: !this.state.isOpenEditUser,
        })
    }

    getAllUsersFromReact = async () => {
        let reponse = await userService.getAllUsers('All')
        if (reponse && reponse.errCode === 0) {
            this.setState({
                arrUsers: reponse.users
            })
        }
    }

    createNewUser = async (data) => {
        try {
            let response = await userService.createNewUserFromService(data)

            if (response && response.errCode !== 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: response.errMessage
                })
            }
            else {
                await this.getAllUsersFromReact();

                this.setState({
                    isOpenModalUser: false
                })

                // 🎉 thông báo thành công
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Tạo user thành công!',
                    timer: 1000,
                    showConfirmButton: false
                })
            }

        } catch (error) {
            console.log(error)
        }
    }


    handleDeleteUser = async (user) => {
        const result = await Swal.fire({
            title: 'Xóa người dùng?',
            text: `Xóa user ${user.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                let res = await userService.deleteUserService(user.id);
                if (res && res.errCode === 0) {
                    await this.getAllUsersFromReact();

                    Swal.fire('Đã xóa!', '', 'success');
                } else {
                    Swal.fire('Lỗi!', res.errMessage, 'error');
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    handleEditUser = (user) => {
        this.setState({
            isOpenEditUser: true,
            userEdit: user
        })
    }

    doEditUser = async (user) => {
        try {
            // ❌ không mutate object gốc
            let data = { ...user }

            // ❌ không gửi password nếu không cần
            delete data.password

            let res = await userService.editUserService(data)

            if (res && res.errCode === 0) {

                // reload data
                await this.getAllUsersFromReact()

                // đóng modal
                this.setState({
                    isOpenEditUser: false
                })

                // thông báo đẹp
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Cập nhật user thành công!',
                    timer: 1200,
                    showConfirmButton: false
                })

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: res.errMessage
                })
            }

        } catch (error) {
            console.log(error)

            Swal.fire({
                icon: 'error',
                title: 'Server error',
                text: 'Có lỗi xảy ra!'
            })
        }
    }
    /** Life cycle
     * Run component:
     * 1. Run construct -> init state
     * 2. Did mount
     * 3. render
     */

    render() {
        let arrUser = this.state.arrUsers
        return (
            <div>
                <Header/>
                <div className="user-container">

                    <ModalUser
                        isOpen={this.state.isOpenModalUser}
                        toggleFromParent={this.toggleUserModal}
                        createNewUser={this.createNewUser}

                    />
                    {
                        this.state.isOpenEditUser && (
                            <ModalEditUser
                                isOpen={this.state.isOpenEditUser}
                                toggleFromParent={this.toggleEditUser}
                                currentUser={this.state.userEdit}
                                editUser={this.doEditUser}
                            />
                        )
                    }
                    <div className='title text-center'>
                        Quản lý người dùng
                    </div>
                    <div className='mx-1'
                        onClick={() => this.handleAddnewUser()}
                    >
                        <button className='btn btn-primary px-3'>Thêm người dùng mới</button>
                    </div>
                    <div className='users-table mt-3 mx-1'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Họ và tên</th>
                                    <th>Email</th>
                                    <th>Số điện thoại</th>
                                    <th>Địa chỉ</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>

                            <tbody>
                                {arrUser && arrUser.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.email}</td>
                                            <td>{item.phone}</td>
                                            <td>{item.address}</td>
                                            <td>
                                                <button
                                                    className='btn-edit'
                                                    onClick={() => this.handleEditUser(item)}
                                                ><i className="fa-solid fa-pencil"></i></button>
                                                <button
                                                    className='btn-delete'
                                                    onClick={() => this.handleDeleteUser(item)}
                                                ><i className="fa-solid fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
