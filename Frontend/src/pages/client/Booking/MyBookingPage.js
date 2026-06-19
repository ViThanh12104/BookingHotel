import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../HomeHeader";
import socket from "../../../utils/socket";
import hotelService from "../../../services/homeService";
import Swal from "sweetalert2";

import "./MyBookingPage.scss";

class MyBookingPage extends Component {
    state = {
        bookings: [],
        isReviewModalOpen: false,
        reviewBooking: null,
        reviewRating: 5,
        reviewComment: "",
        submittingReview: false,
        expandedReviews: {}
    };

    async componentDidMount() {
        this.getBookingList();
        this.registerSocketListeners();
    }

    componentWillUnmount() {
        if (!socket) return;

        socket.off("bookingCreated", this.handleSocketBookingEvent);
        socket.off("bookingUpdated", this.handleSocketBookingEvent);
    }

    registerSocketListeners = () => {
        if (!socket) return;

        socket.on("bookingCreated", this.handleSocketBookingEvent);
        socket.on("bookingUpdated", this.handleSocketBookingEvent);
    };

    handleSocketBookingEvent = async (event) => {
        const user = this.getCurrentUser();
        if (!user) return;

        if (event.userId && Number(event.userId) === Number(user.id)) {
            await this.getBookingList();
        }
    };

    // ✅ LẤY USER AN TOÀN (fix reload)
    getCurrentUser = () => {
        let user = this.props.userInfor;

        if (!user) {
            user = JSON.parse(localStorage.getItem("user"));
        }

        return user;
    };

    // ✅ LOAD DANH SÁCH BOOKING
    getBookingList = async () => {
        const user = this.getCurrentUser();
        if (!user) return;

        let res = await hotelService.getBookingByUser(user.id);

        if (res && res.errCode === 0) {
            const list = res.data || res.bookings || [];
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            this.setState({
                bookings: list
            });
        }
    };

    // ✅ HỦY BOOKING
    handleCancel = async (id) => {
        const user = this.getCurrentUser();

        if (!user) {
            return Swal.fire({
                title: "Lỗi!",
                text: "Không tìm thấy người dùng.",
                icon: "error"
            });
        }

        try {
            const result = await Swal.fire({
                title: "Bạn có chắc?",
                text: "Bạn muốn hủy phòng này!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e3342f",
                cancelButtonColor: "#6c757d",
                confirmButtonText: "Có, hủy ngay",
                cancelButtonText: "Không"
            });

            if (!result.isConfirmed) return;

            let res = await hotelService.cancelBooking(id, user.id);

            if (res && res.errCode === 0) {
                await Swal.fire({
                    title: "Đã hủy!",
                    text: "Đơn đặt phòng đã được hủy.",
                    icon: "success"
                });

                this.getBookingList();
            } else {
                await Swal.fire({
                    title: "Hủy thất bại!",
                    text: res?.errMessage || "Có lỗi xảy ra.",
                    icon: "error"
                });
            }

        } catch (error) {
            console.error(error);

            await Swal.fire({
                title: "Lỗi hệ thống!",
                text: "Không thể kết nối server.",
                icon: "error"
            });
        }
    };

    // --- REVIEW MODAL ---
    openReviewModal = (booking) => {
        this.setState({
            isReviewModalOpen: true,
            reviewBooking: booking,
            reviewRating: 5,
            reviewComment: ""
        });
    };

    closeReviewModal = () => {
        this.setState({
            isReviewModalOpen: false,
            reviewBooking: null,
            reviewRating: 5,
            reviewComment: ""
        });
    };

    handleSubmitReview = async () => {
        const user = this.getCurrentUser();
        if (!user) return;

        const { reviewBooking, reviewRating, reviewComment } = this.state;

        if (!reviewBooking) return;

        this.setState({ submittingReview: true });

        try {
            const payload = {
                hotel_id: reviewBooking.bookingRoom?.hotel_id,
                booking_id: reviewBooking.id,
                rating: reviewRating,
                comment: reviewComment
            };

            let res = await hotelService.createReview(payload);

            if (res && res.errCode === 0) {
                this.closeReviewModal();
                await Swal.fire({ title: "Cảm ơn!", text: "Đã gửi đánh giá.", icon: "success" });
                this.getBookingList();
            } else {
                await Swal.fire({ title: "Thất bại", text: res?.errMessage || "Có lỗi xảy ra.", icon: "error" });
            }

        } catch (e) {
            console.error(e);
            await Swal.fire({ title: "Lỗi", text: "Không thể kết nối server.", icon: "error" });
        } finally {
            this.setState({ submittingReview: false });
        }
    };

    formatDate = (date) => {
        return new Date(date).toLocaleDateString("vi-VN");
    };

    render() {
        const { bookings } = this.state;

        return (
            <div className="my-booking-page">
                <HomeHeader />

                <div className="booking-header">
                    <h1>Đơn đặt phòng của bạn</h1>
                </div>

                <div className="booking-list">

                    {bookings.length === 0 && (
                        <div className="empty">
                            Bạn chưa có đơn đặt phòng nào
                        </div>
                    )}

                    {bookings.map((item) => (
                        <div className="booking-card" key={item.id}>

                            {/* IMAGE */}
                            <div className="booking-image">
                                <img
                                    src={item.bookingRoom?.roomImages?.[0]?.image_url}
                                    alt="room"
                                />
                            </div>

                            {/* INFO */}
                            <div className="booking-info">

                                {/* TOP */}
                                <div className="top-info">

                                    <div>

                                        <h3>
                                            {item.bookingRoom?.room_type || `Phòng #${item.room_id}`}
                                        </h3>

                                        <div className="room-meta">

                                            <div className="meta-item">
                                                <span className="label">
                                                    Thông tin:
                                                </span>

                                                <span>
                                                    {item.bookingRoom?.bed_info}
                                                </span>
                                            </div>

                                            <div className="meta-item">
                                                <span className="label">
                                                    Diện tích:
                                                </span>

                                                <span>
                                                    {item.bookingRoom?.size}
                                                </span>
                                            </div>

                                            <div className="meta-item">
                                                <span className="label">
                                                    Ngày nhận:
                                                </span>

                                                <span>
                                                    {this.formatDate(item.check_in)}
                                                </span>
                                            </div>

                                            <div className="meta-item">
                                                <span className="label">
                                                    Ngày trả:
                                                </span>

                                                <span>
                                                    {this.formatDate(item.check_out)}
                                                </span>
                                            </div>

                                        </div>

                                    </div>

                                    {/* STATUS */}
                                <span className={`status ${item.status}`}>
                                        {item.status === "pending" && "Đang chờ"}
                                        {item.status === "confirmed" && "Đã xác nhận"}
                                        {item.status === "checked_in" && "Đang lưu trú"}
                                        {item.status === "completed" && "Đã trả phòng"}
                                        {item.status === "cancelled" && "Đã hủy"}
                                    </span>

                                </div>

                                {/* PRICE */}
                                <div className="booking-detail">

                                    <p className="price">
                                        {Number(item.total_price).toLocaleString("vi-VN")} VND
                                    </p>

                                </div>

                                {/* ACTION */}
                                <div className="booking-actions">

                                        {item.status !== "cancelled" &&
                                            item.status !== "completed" && (
                                                <button
                                                    className="cancel-btn"
                                                    onClick={() => this.handleCancel(item.id)}
                                                >
                                                    Hủy phòng
                                                </button>
                                            )}

                                        {/* Nếu đã hoàn thành và chưa có review -> cho viết review */}
                                        {item.status === "completed" && !item.bookingReview && (
                                            <button
                                                className="review-btn"
                                                onClick={() => this.openReviewModal(item)}
                                            >
                                                Viết đánh giá
                                            </button>
                                        )}

                                        {/* Nếu đã review -> hiển thị nhắc */}
                                        {item.status === "completed" && item.bookingReview && (
                                            <span className="reviewed">Đã đánh giá</span>
                                        )}

                                </div>

                                {item.bookingReview && (
                                    <div className="booking-review-card">
                                        <div className="booking-review-header">
                                            <span className="booking-review-user">Bạn đã đánh giá</span>
                                            <span className="booking-review-stars">
                                                {'★'.repeat(item.bookingReview.rating || 0)}{'☆'.repeat(5 - (item.bookingReview.rating || 0))}
                                            </span>
                                        </div>
                                        <p className="booking-review-comment">
                                            {item.bookingReview.comment?.length > 120 && !this.state.expandedReviews[item.id]
                                                ? `${item.bookingReview.comment.slice(0, 120)}...`
                                                : item.bookingReview.comment}
                                        </p>
                                        {item.bookingReview.comment && item.bookingReview.comment.length > 120 && (
                                            <button
                                                className="booking-review-toggle"
                                                onClick={() => {
                                                    this.setState(prev => ({
                                                        expandedReviews: {
                                                            ...prev.expandedReviews,
                                                            [item.id]: !prev.expandedReviews[item.id]
                                                        }
                                                    }));
                                                }}
                                            >
                                                {this.state.expandedReviews[item.id] ? 'Thu gọn' : 'Xem thêm'}
                                            </button>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}

                </div>
                {this.state.isReviewModalOpen && (
                    <div className="review-modal-overlay">
                        <div className="review-modal">
                            <h3>Đánh giá cho đơn #{this.state.reviewBooking?.id}</h3>

                            <div className="rating-row">
                                {[1,2,3,4,5].map(star => (
                                    <button
                                        key={star}
                                        className={`star ${this.state.reviewRating >= star ? 'active' : ''}`}
                                        onClick={() => this.setState({ reviewRating: star })}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>

                            <textarea
                                placeholder="Viết nhận xét của bạn..."
                                value={this.state.reviewComment}
                                onChange={(e) => this.setState({ reviewComment: e.target.value })}
                            />

                            <div className="modal-actions">
                                <button className="btn" onClick={this.closeReviewModal} disabled={this.state.submittingReview}>Hủy</button>
                                <button className="btn primary" onClick={this.handleSubmitReview} disabled={this.state.submittingReview}>Gửi đánh giá</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    userInfor: state.user.userInfor
});

export default connect(mapStateToProps)(MyBookingPage);