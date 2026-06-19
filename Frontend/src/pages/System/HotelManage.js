import React, { Component } from 'react';
import Header from '../../components/Header/Header'
import adminService from '../../services/adminService';
import ModalAddHotel from './Modal/ModalAddHotel';
import ModalEditHotel from './Modal/ModalEditHotel';
import './HotelManage.scss';
import Swal from "sweetalert2";
class HotelManage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            arrHotels: [],
            currentPage: 1,
            hotelsPerPage: 5,
            isOpenModalAdd: false,
            isOpenModalEdit: false,
            currentHotel: {}
        }
    }
    openAddModal = () => {

        this.setState({

            isOpenModalAdd: true,

            isOpenModalEdit: false,

            currentHotel: {}
        });
    }

    openEditModal = (hotel) => {

        this.setState({

            isOpenModalEdit: true,

            isOpenModalAdd: false,

            currentHotel: hotel
        });
    }

    async componentDidMount() {

        await this.getAllHotels();
    }

    getAllHotels = async () => {

        try {

            let res =
                await adminService.getAllHotels();

            if (res && res.errCode === 0) {

                this.setState({
                    arrHotels: res.hotels || []
                })
            }

        } catch (e) {

            console.log(e);
        }
    }
    handleCreateHotel = async (data) => {

        try {

            let res =
                await adminService.createNewHotel(data);

            if (res && res.errCode === 0) {

                Swal.fire({

                    icon: "success",

                    title: "Thành công",

                    text: "Tạo khách sạn thành công!"
                });

                this.setState({

                    isOpenModalAdd: false
                });

                await this.getAllHotels();
            }
            else {

                Swal.fire({

                    icon: "error",

                    title: "Lỗi...",

                    text: res.errMessage
                });
            }

        } catch (e) {

            console.log(e);

            Swal.fire({

                icon: "error",

                title: "Lỗi máy chủ",

                text: "Đã có lỗi xảy ra!"
            });
        }
    }
    handleEditHotel = async (data) => {

        try {

            let res =
                await adminService.updateHotel(data);

            if (res && res.errCode === 0) {

                Swal.fire({

                    icon: "success",

                    title: "Thành công",

                    text: "Cập nhật khách sạn thành công!"
                });

                this.setState({

                    isOpenModalEdit: false
                });

                await this.getAllHotels();
            }
            else {

                Swal.fire({

                    icon: "error",

                    title: "Lỗi...",

                    text: res.errMessage
                });
            }

        } catch (e) {

            console.log(e);

            Swal.fire({

                icon: "error",

                title: "Lỗi máy chủ",

                text: "Đã có lỗi xảy ra!"
            });
        }
    }

    handleDeleteHotel = async (hotel) => {

        if (!hotel || !hotel.id) {
            return;
        }

        const result = await Swal.fire({
            icon: "warning",
            title: "Xóa khách sạn?",
            text: `Khách sạn "${hotel.name}" sẽ bị xóa.`,
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            confirmButtonColor: "#ff4d4f"
        });

        if (!result.isConfirmed) {
            return;
        }

        try {

            const nextTotal =
                Math.max(
                    this.state.arrHotels.length - 1,
                    0
                );

            let res = await adminService.deleteHotel(hotel.id);

            if (res && res.errCode === 0) {

                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: "Xóa khách sạn thành công!"
                });

                await this.getAllHotels();

                const maxPage =
                    Math.max(
                        1,
                        Math.ceil(
                            nextTotal /
                            this.state.hotelsPerPage
                        )
                    );

                if (this.state.currentPage > maxPage) {
                    this.setState({
                        currentPage: maxPage
                    });
                }
            } else {

                Swal.fire({
                    icon: "error",
                    title: "Lỗi...",
                    text: res?.errMessage || "Xóa khách sạn thất bại!"
                });
            }
        } catch (e) {

            console.log(e);

            Swal.fire({
                icon: "error",
                title: "Lỗi máy chủ",
                text: "Đã có lỗi xảy ra!"
            });
        }
    }

    render() {

        let {
            arrHotels,

            currentPage,

            hotelsPerPage

        } = this.state;

        const indexOfLastHotel =
            currentPage * hotelsPerPage;

        const indexOfFirstHotel =
            indexOfLastHotel - hotelsPerPage;

        const currentHotels =
            arrHotels.slice(
                indexOfFirstHotel,
                indexOfLastHotel
            );

        const totalPages =
            Math.ceil(
                arrHotels.length /
                hotelsPerPage
            );

        return (

            <div className="hotel-manage-container">


                <Header />

                <div className="hotel-manage-content">

                    <div className="hotel-top">

                        <h2>
                            Quản lý khách sạn
                        </h2>

                        <button className="btn-add-hotel"
                            onClick={() => this.openAddModal()}
                        >

                            <i className="fas fa-plus"></i>

                            Thêm khách sạn

                        </button>

                    </div>

                    {/* TABLE */}

                    <div className="hotel-table-modern">

                        <table>

                            <thead>

                                <tr>

                                    <th>Ảnh đại diện</th>

                                    <th>Tên khách sạn</th>

                                    <th>Thành phố</th>

                                    <th>Địa chỉ</th>

                                    <th>Mô tả</th>

                                    <th>Hành động</th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    currentHotels &&
                                    currentHotels.length > 0 &&

                                    currentHotels.map((item) => {

                                        return (

                                            <tr key={item.id}>

                                                {/* IMAGE */}

                                                <td>

                                                    <img
                                                        src={item.thumbnail}
                                                        alt=""
                                                        className="hotel-thumbnail"
                                                    />

                                                </td>

                                                {/* NAME */}

                                                <td>

                                                    <div className="hotel-name">

                                                        {item.name}

                                                    </div>

                                                </td>

                                                {/* CITY */}

                                                <td>

                                                    <span className="hotel-city">

                                                        {item.city}

                                                    </span>

                                                </td>

                                                {/* ADDRESS */}

                                                <td className="hotel-address">

                                                    {item.address}

                                                </td>

                                                {/* DESCRIPTION */}

                                                <td>

                                                    <div className="hotel-description">

                                                        {item.description}

                                                    </div>

                                                </td>

                                                <td>

                                                    <div className="hotel-actions">

                                                        <button className="btn-edit"
                                                            onClick={() => this.openEditModal(item)}
                                                        >

                                                            <i className="fas fa-edit"></i>

                                                            Sửa

                                                        </button>

                                                        <button className="btn-delete"
                                                            onClick={() => this.handleDeleteHotel(item)}
                                                        >

                                                            <i className="fas fa-trash"></i>

                                                            Xóa

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        )
                                    })
                                }

                                {
                                    (!currentHotels || currentHotels.length === 0) &&
                                    <tr>
                                        <td colSpan="6" className="empty-hotels">
                                            Không có khách sạn nào
                                        </td>
                                    </tr>
                                }

                            </tbody>

                        </table>

                    </div>

                    {/* PAGINATION */}

                    <div className="pagination">

                        {
                            [...Array(totalPages)].map(
                                (_, index) => {

                                    return (

                                        <button

                                            key={index}

                                            className={
                                                currentPage ===
                                                    index + 1
                                                    ? 'active'
                                                    : ''
                                            }

                                            onClick={() =>
                                                this.setState({
                                                    currentPage:
                                                        index + 1
                                                })
                                            }
                                        >
                                            {index + 1}
                                        </button>
                                    )
                                }
                            )
                        }

                    </div>

                </div>
                {
                    this.state.isOpenModalAdd &&

                    <ModalAddHotel
                        closeModal={() =>
                            this.setState({
                                isOpenModalAdd: false
                            })
                        }
                        createHotel={this.handleCreateHotel}
                    />
                }

                {
                    this.state.isOpenModalEdit &&

                    <ModalEditHotel
                        closeModal={() =>
                            this.setState({

                                isOpenModalEdit: false,

                                currentHotel: {}
                            })
                        }
                        currentHotel={this.state.currentHotel}
                        editHotel={this.handleEditHotel}
                    />
                }

            </div>
        )
    }
}

export default HotelManage;
