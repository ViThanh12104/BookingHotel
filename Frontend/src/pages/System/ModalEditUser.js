import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ModalEditUser extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: '',
            name: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            gender: '1',
            role: ''
        }
    }

    componentDidMount() {
        let user = this.props.currentUser;

        if (user && Object.keys(user).length > 0) {
            this.setState({
                id: user.id,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',

                gender: user.gender ? '1' : '0',


                role: user.role || 'customer',
                password: 'ádad123'
            });
        }
    }
    componentDidUpdate(prevProps) {
        // khi nhận user mới
        if (prevProps.currentUser !== this.props.currentUser) {
            let user = this.props.currentUser;

            if (user && Object.keys(user).length > 0) {
                this.setState({
                    id: user.id,
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    address: user.address || '',
                    gender: user.gender ? '1' : '0',
                    role: user.role || 'customer',
                    password: ''
                });
            }
        }

        // reset khi đóng modal
        if (prevProps.isOpen !== this.props.isOpen && this.props.isOpen === false) {
            this.setState({
                id: user.id,
                name: '',
                email: '',
                password: '',
                phone: '',
                address: '',
                gender: user.gender ? '1' : '0',
                role: user.role || 'customer',
            });
        }
    }

    toggle = () => {
        this.props.toggleFromParent()
    }

    handleOnChangeInput = (event, id) => {
        let value = event.target.value;

        this.setState({
            [id]: value
        })
    }

    checkValidateModal = () => {
        let isValid = true
        let arrModal = ['name', 'phone', 'address', 'gender', 'role']
        for (let i = 0; i < arrModal.length; i++) {
            if (!this.state[arrModal[i]]) {
                isValid = false
                alert('Missing parameter: ' + arrModal[i])
                break
            }
        }
        return isValid
    }

    handleUpdateUser = () => {
        let isValid = this.checkValidateModal()
        if (isValid === true) {
            this.props.editUser(this.state)
        }

    }

    do

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className='abcClassName'
                size='lg'
                centered
            >
                <ModalHeader toggle={() => { this.toggle() }}>
                    Chỉnh sửa người dùng
                </ModalHeader>

                <ModalBody>
                    <form className="px-2">

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Họ và tên</label>
                                <input type="text"
                                    className="form-control"
                                    placeholder="Họ và tên"
                                    value={this.state.name}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'name') }} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Email</label>
                                <input type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={this.state.email}
                                    autoComplete="email"
                                    disabled
                                    onChange={(event) => { this.handleOnChangeInput(event, 'email') }}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Mật khẩu mới</label>
                                <input type="password"
                                    className="form-control"
                                    placeholder="Mật khẩu"
                                    autoComplete="current-password"
                                    value={this.state.password}
                                    disabled
                                    onChange={(event) => { this.handleOnChangeInput(event, 'password') }} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Số điện thoại</label>
                                <input type="text"
                                    className="form-control"
                                    placeholder="Số điện thoại"
                                    value={this.state.phone}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'phone') }} />
                            </div>

                            <div className="col-12">
                                <label className="form-label">Địa chỉ</label>
                                <input type="text"
                                    className="form-control"
                                    placeholder="Địa chỉ"
                                    value={this.state.address}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'address') }} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Giới tính</label>
                                <select className="form-select"
                                    value={this.state.gender}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'gender') }}
                                >
                                    <option value="1">Nam</option>
                                    <option value="0">Nữ</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Vai trò</label>
                                <select className="form-select"
                                    value={this.state.role}
                                    onChange={(event) => { this.handleOnChangeInput(event, 'role') }}>
                                    <option value="customer">Khách hàng</option>
                                    <option value="admin">Quản trị viên</option>

                                </select>
                            </div>
                        </div>

                    </form>
                </ModalBody>

                <ModalFooter className="d-flex justify-content-end gap-2">
                    <Button
                        color="primary"
                        className="px-4 fw-semibold"
                        onClick={() => { this.handleUpdateUser() }}
                    >
                        Lưu
                    </Button>

                    <Button
                        color="secondary"
                        className="px-4"
                        onClick={() => { this.toggle() }}
                    >
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>


        )
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
