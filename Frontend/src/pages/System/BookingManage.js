import React, { Component } from 'react';
import Header from '../../components/Header/Header';

import socket from '../../utils/socket';
import adminService from '../../services/adminService';

import './BookingManage.scss';

class BookingManage extends Component {

    state = {
        bookings: [],
        currentPage: 1,
        limit: 10,

        searchCustomer: "",
        searchRoom: "",

        statusFilter: ""
    };

    async componentDidMount() {
        await this.getAllBookings();
        this.registerSocketListeners();
    }

    registerSocketListeners = () => {
        if (!socket) return;

        socket.on("bookingCreated", this.handleRealtimeBookingEvent);
        socket.on("bookingUpdated", this.handleRealtimeBookingEvent);
        socket.on("roomAvailabilityUpdated", this.handleRealtimeRoomAvailability);
    };

    componentWillUnmount() {
        if (!socket) return;

        socket.off("bookingCreated", this.handleRealtimeBookingEvent);
        socket.off("bookingUpdated", this.handleRealtimeBookingEvent);
        socket.off("roomAvailabilityUpdated", this.handleRealtimeRoomAvailability);
    }

    handleRealtimeBookingEvent = async (event) => {
        if (!event) return;
        await this.getAllBookings();
    };

    handleRealtimeRoomAvailability = (event) => {
        if (!event) return;
        this.setState((prevState) => ({
            bookings: prevState.bookings.map((booking) => {
                if (booking.bookingRoom?.id === event.roomId) {
                    return {
                        ...booking,
                        bookingRoom: {
                            ...booking.bookingRoom,
                            available_count: event.availableCount
                        }
                    };
                }
                return booking;
            })
        }));
    };

    getAllBookings = async () => {

        let res = await adminService.getAllBookings();

        if (res && res.errCode === 0) {
            let list = res.bookings || res.data || [];
            if (!Array.isArray(list)) {
                list = [];
            }

            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            this.setState({
                bookings: list
            });
        }
    };

    formatDate = (date) => {
        return new Date(date).toLocaleDateString("vi-VN");
    };

    handleConfirm = async (bookingId) => {

        let res = await adminService.confirmBooking(bookingId);

        if (res && res.errCode === 0) {
            await this.getAllBookings();
        }
    };

    handleCancel = async (bookingId) => {

        let res = await adminService.cancelBooking(bookingId);

        if (res && res.errCode === 0) {
            await this.getAllBookings();
        }
    };
    handleCheckin = async (bookingId) => {

        let res =
            await adminService.checkinBooking(
                bookingId
            );

        if (res && res.errCode === 0) {

            await this.getAllBookings();
        }
    };

    handleCheckout = async (bookingId) => {

        let res =
            await adminService.checkoutBooking(
                bookingId
            );

        if (res && res.errCode === 0) {

            await this.getAllBookings();
        }
    };

    render() {

        let {
            bookings,
            currentPage,
            limit
        } = this.state;

        const indexOfLast =
            currentPage * limit;

        const indexOfFirst =
            indexOfLast - limit;


        const filteredBookings =
            bookings.filter((item) => {

                /* CUSTOMER */
                const matchCustomer =
                    item.bookingUser?.name
                        ?.toLowerCase()
                        .includes(
                            this.state.searchCustomer
                                .toLowerCase()
                        );

                /* ROOM */
                const matchRoom =
                    item.bookingRoom?.room_type
                        ?.toLowerCase()
                        .includes(
                            this.state.searchRoom
                                .toLowerCase()
                        );

                /* STATUS */
                const matchStatus =
                    this.state.statusFilter
                        ? item.status === this.state.statusFilter
                        : true;

                return matchCustomer
                    && matchRoom
                    && matchStatus;
            });
        const currentBookings =
            filteredBookings.slice(
                indexOfFirst,
                indexOfLast
            );

        const totalPages =
            Math.ceil(
                filteredBookings.length / limit
            );

        return (
            <div className="manage-booking-page">

                <Header />

                {/* TOP FIXED */}
                <div className="manage-top">

                    {/* <div className="manage-header">
                        <h1>Quản lý đặt phòng</h1>
                    </div> */}

                    <div className="booking-filter">

                        {/* TÊN KHÁCH */}
                        <input
                            type="text"
                            placeholder="Tìm khách hàng..."
                            value={this.state.searchCustomer}
                            onChange={(e) =>
                                this.setState({
                                    searchCustomer: e.target.value,
                                    currentPage: 1
                                })
                            }
                        />

                        {/* TÊN PHÒNG */}
                        <input
                            type="text"
                            placeholder="Tìm loại phòng..."
                            value={this.state.searchRoom}
                            onChange={(e) =>
                                this.setState({
                                    searchRoom: e.target.value,
                                    currentPage: 1
                                })
                            }
                        />

                        {/* TRẠNG THÁI */}
                        <select
                            value={this.state.statusFilter}
                            onChange={(e) =>
                                this.setState({
                                    statusFilter: e.target.value,
                                    currentPage: 1
                                })
                            }
                        >
                            <option value="">
                                Tất cả trạng thái
                            </option>

                            <option value="pending">
                                Đang chờ
                            </option>

                            <option value="confirmed">
                                Đã xác nhận
                            </option>

                            <option value="checked_in">
                                Đang lưu trú
                            </option>

                            <option value="completed">
                                Đã trả phòng
                            </option>

                            <option value="cancelled">
                                Đã hủy
                            </option>

                        </select>

                    </div>
                </div>

                {/* CONTENT */}
                <div className="manage-booking-container">

                    <div className="booking-table">

                        <table>

                            <thead>
                                <tr>
                                    <th>Khách hàng</th>
                                    <th>Phòng</th>
                                    <th>Ngày nhận</th>
                                    <th>Ngày trả</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>

                            <tbody>

                                {currentBookings &&
                                    currentBookings.length > 0 &&
                                    currentBookings.map((item) => (

                                        <tr key={item.id}>

                                            {/* KHÁCH HÀNG */}
                                            <td>

                                                <div className="user-info">

                                                    <img
                                                        src={
                                                            item.bookingRoom
                                                                ?.roomImages?.[0]
                                                                ?.image_url
                                                        }
                                                        alt="room"
                                                    />

                                                    <div>

                                                        <h4>
                                                            {item.bookingUser?.name}
                                                        </h4>

                                                        <p>
                                                            {item.bookingUser?.email}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* PHÒNG */}
                                            <td>
                                                {item.bookingRoom?.room_type}
                                            </td>

                                            {/* NGÀY NHẬN */}
                                            <td>
                                                {this.formatDate(item.check_in)}
                                            </td>

                                            {/* NGÀY TRẢ */}
                                            <td>
                                                {this.formatDate(item.check_out)}
                                            </td>

                                            {/* TỔNG TIỀN */}
                                            <td className="price">

                                                {Number(item.total_price)
                                                    .toLocaleString("vi-VN")}đ

                                            </td>

                                            {/* TRẠNG THÁI */}
                                            <td>

                                                <span className={`status ${item.status}`}>

                                                    {item.status === "pending" &&
                                                        "Đang chờ"}

                                                    {item.status === "confirmed" &&
                                                        "Đã xác nhận"}

                                                    {item.status === "checked_in" &&
                                                        "Đang lưu trú"}

                                                    {item.status === "completed" &&
                                                        "Đã trả phòng"}

                                                    {item.status === "cancelled" &&
                                                        "Đã hủy"}

                                                </span>

                                            </td>

                                            {/* ACTION */}
                                            <td>

                                                <div className="action-group">

                                                    {/* CONFIRM */}
                                                    {item.status === "pending" && (
                                                        <button
                                                            className="confirm-btn"
                                                            onClick={() =>
                                                                this.handleConfirm(item.id)
                                                            }
                                                        >
                                                            Xác nhận
                                                        </button>
                                                    )}

                                                    {/* CHECK IN */}
                                                    {item.status === "confirmed" && (
                                                        <button
                                                            className="checkin-btn"
                                                            onClick={() =>
                                                                this.handleCheckin(item.id)
                                                            }
                                                        >
                                                            Nhận phòng
                                                        </button>
                                                    )}

                                                    {/* CHECK OUT */}
                                                    {item.status === "checked_in" && (
                                                        <button
                                                            className="checkout-btn"
                                                            onClick={() =>
                                                                this.handleCheckout(item.id)
                                                            }
                                                        >
                                                            Trả phòng
                                                        </button>
                                                    )}

                                                    {/* CANCEL */}
                                                    {/* CANCEL */}
                                                    {item.status === "pending" && (
                                                        <button
                                                            className="cancel-btn"
                                                            onClick={() =>
                                                                this.handleCancel(item.id)
                                                            }
                                                        >
                                                            Hủy
                                                        </button>
                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                            </tbody>

                        </table>

                        <div className="pagination">

                            {[...Array(totalPages)].map((_, index) => (

                                <button
                                    key={index}

                                    className={
                                        currentPage === index + 1
                                            ? "page-btn active"
                                            : "page-btn"
                                    }

                                    onClick={() =>
                                        this.setState({
                                            currentPage: index + 1
                                        })
                                    }
                                >
                                    {index + 1}
                                </button>

                            ))}

                        </div>

                    </div>

                </div>

            </div>
        );
    }
}

export default BookingManage;