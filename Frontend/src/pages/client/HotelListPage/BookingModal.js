import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Swal from "sweetalert2";

import hotelService from "../../../services/homeService";

import "./BookingModal.scss";

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkIn: "",
            checkOut: "",
            guests: 1
        };
    }

    calculateNights = () => {
        const { checkIn, checkOut } = this.state;
        if (!checkIn || !checkOut) return 0;

        const diff =
            new Date(checkOut) - new Date(checkIn);

        return diff > 0
            ? diff / (1000 * 60 * 60 * 24)
            : 0;
    };

    handleSubmit = async () => {
        const { room, user, onClose } = this.props;
        const { checkIn, checkOut } = this.state;

        // ❌ chưa login
        if (!user) {
            onClose();

            setTimeout(() => {
                Swal.fire({
                    icon: "warning",
                    title: "Chưa đăng nhập",
                    text: "Vui lòng đăng nhập để đặt phòng",
                    confirmButtonText: "Đăng nhập"
                }).then(() => {
                    window.location.href = "/login";
                });
            }, 200);

            return;
        }

        // validate
        if (!checkIn || !checkOut) {
            Swal.fire("Lỗi", "Vui lòng chọn ngày!", "error");
            return;
        }

        if (this.calculateNights() <= 0) {
            Swal.fire("Lỗi", "Ngày không hợp lệ!", "error");
            return;
        }

        try {
            // 🔥 gọi API thật
            let res = await hotelService.createBooking({
                user_id: user.id,
                room_id: room.id,
                check_in: checkIn,
                check_out: checkOut
            });

            if (res && res.errCode === 0) {

                onClose(); // đóng modal

                setTimeout(() => {
                    Swal.fire({
                        icon: "success",
                        title: "Đặt phòng thành công!",
                        text: `${room.room_type}`,
                        timer: 1500,
                        showConfirmButton: false
                    });
                }, 200);

            } else {
                Swal.fire("Lỗi", res.errMessage, "error");
            }

        } catch (e) {
            console.error(e);

            Swal.fire({
                icon: "error",
                title: "Server lỗi",
                text: "Không thể đặt phòng!"
            });
        }
    };

    render() {
        const { room, onClose } = this.props;
        const { checkIn, checkOut, guests } = this.state;

        if (!room) return null;

        const nights = this.calculateNights();
        const total = nights * room.price;

        return (
            <div className="booking-modal" onClick={onClose}>
                <div
                    className="booking-container"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="booking-close" onClick={onClose}>×</div>

                    <h2>Đặt phòng</h2>

                    {/* ROOM INFO */}
                    <div className="booking-room">
                        <div className="room-name">
                            {room.room_type}
                        </div>
                        <div className="room-price">
                            {Number(room.price).toLocaleString("vi-VN")}đ / đêm
                        </div>
                    </div>

                    {/* FORM */}
                    <div className="booking-form">

                        <div className="form-group">
                            <label>Nhận phòng</label>
                            <input
                                type="date"
                                value={checkIn}
                                onChange={(e) =>
                                    this.setState({ checkIn: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Trả phòng</label>
                            <input
                                type="date"
                                value={checkOut}
                                onChange={(e) =>
                                    this.setState({ checkOut: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Số khách</label>
                            <input
                                type="number"
                                min="1"
                                value={guests}
                                onChange={(e) =>
                                    this.setState({ guests: e.target.value })
                                }
                            />
                        </div>

                        {/* SUMMARY */}
                        <div className="booking-summary">
                            <div>
                                {Number(room.price).toLocaleString("vi-VN")}đ × {nights} đêm
                            </div>

                            <div className="total">
                                Tổng: {Number(total).toLocaleString("vi-VN")}đ
                            </div>
                        </div>

                        {/* ERROR */}
                        {checkIn && checkOut && nights === 0 && (
                            <div className="error">
                                Ngày không hợp lệ
                            </div>
                        )}

                        <button
                            className="confirm-btn"
                            disabled={!checkIn || !checkOut || nights === 0}
                            onClick={this.handleSubmit}
                        >
                            Xác nhận đặt phòng
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user.userInfor
    };
};

export default withRouter(connect(mapStateToProps)(BookingModal));