// src/pages/client/HotelDetailPage/HotelDetailPage.js
// style giống Booking.com hơn

import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import HomeHeader from "../HomeHeader";
import homeService from "../../../services/homeService";
import "./HotelDetailPage.scss";

import BookingModal from "./BookingModal";

import RoomDetailModal from "./RoomDetailModal";

class HotelDetailPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            hotelDetail: {},
            reviews: [],
            previewImage: "",
            previewIndex: 0,
            selectedRoom: null,
            isOpenRoomModal: false,
            isOpenBookingModal: false,
            bookingRoom: null,
            reviewFilter: 0,
            showAllReviews: false,
            reviewSummary: "",
            // removed AI review summary
        };
    }

    async componentDidMount() {
        const hotelId = this.props.match.params.id;

        if (hotelId) {
            await this.fetchHotelDetail(hotelId);
        }
    }

    fetchHotelDetail = async (hotelId) => {
        try {
            let res = await homeService.getHotelDetail(hotelId);

            if (res && res.errCode === 0) {
                this.setState({
                    hotelDetail: res.hotel,
                    rooms: res.hotel.rooms || []
                });
                this.fetchReviews(hotelId);
            }
        } catch (e) {
            console.log("Fetch hotel detail error:", e);
        }
    };

    fetchReviews = async (hotelId) => {
        try {
            let res = await homeService.getReviewByHotel(hotelId);

            if (res && res.errCode === 0) {
                this.setState({ reviews: res.reviews || [] });
            }
        } catch (e) {
            console.log("Fetch reviews error:", e);
        }
    };

    // AI review summary removed

    handleBookingRoom = (roomId) => {
        this.props.history.push(`/booking/${roomId}`);
    };

    handleReviewFilter = (rating) => {
        this.setState({ reviewFilter: rating, showAllReviews: false });
    };

    toggleShowAllReviews = () => {
        this.setState((prevState) => ({ showAllReviews: !prevState.showAllReviews }));
    };

    computeRatingOverview = () => {
        const { reviews } = this.state;
        const total = reviews.length || 0;

        if (total === 0) {
            return { total: 0, average: 0, counts: [0, 0, 0, 0, 0] };
        }

        const counts = [5, 4, 3, 2, 1].map((star) =>
            reviews.filter((r) => Number(r.rating) === star).length
        );

        const average = (
            reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / total
        ).toFixed(1);

        return { total, average, counts };
    };

    render() {
        const { hotelDetail, rooms, reviews, reviewFilter, showAllReviews } = this.state;

        if (!hotelDetail) {
            return <div className="loading">Loading...</div>;
        }

        const filteredReviews = reviews.filter((r) => {
            return reviewFilter === 0 || r.rating === reviewFilter;
        });

        const visibleReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3);

        const ratingOptions = [0, 5, 4, 3, 2, 1];

        return (
            <div className="hotel-detail-page">
                <HomeHeader />

                <div className="hotel-detail-container">

                    {/* HEADER INFO */}
                    <div className="detail-header">
                        <div className="detail-left">
                            <h1>{hotelDetail.name}</h1>



                            <div className="hotel-review">
                                <span className="review-score">
                                    {hotelDetail.rating || 8.5}
                                </span>

                                <span className="review-text">
                                    Tuyệt vời
                                </span>
                            </div>
                        </div>

                        {/* <div className="detail-right">
                            <button className="reserve-btn">
                                Tôi sẽ đặt
                            </button>
                        </div> */}
                    </div>

                    {/* MAIN IMAGE */}
                    <div className="hotel-gallery">
                        {/* Hàng trên */}
                        <div className="gallery-top">

                            {/* Ảnh lớn */}
                            {hotelDetail.hotelImages?.length > 0 && (
                                <div
                                    className="gallery-main"
                                    onClick={() =>
                                        this.setState({
                                            previewImage: hotelDetail.hotelImages[0].image_url
                                        })
                                    }
                                >
                                    <img
                                        src={hotelDetail.hotelImages[0].image_url}
                                        alt={hotelDetail.name}
                                    />
                                </div>
                            )}

                            {/* 2 ảnh bên phải */}
                            <div className="gallery-right">
                                {hotelDetail.hotelImages
                                    ?.slice(1, 3)
                                    .map((image, index) => (
                                        <div
                                            className="gallery-right-item"
                                            key={index}
                                            onClick={() =>
                                                this.setState({
                                                    previewImage: image.image_url
                                                })
                                            }
                                        >
                                            <img
                                                src={image.image_url}
                                                alt={`right-${index}`}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Hàng dưới */}
                        <div className="gallery-bottom">
                            {hotelDetail.hotelImages
                                ?.slice(3, 8)
                                .map((image, index) => {
                                    const totalImages = hotelDetail.hotelImages.length;
                                    const remainImages = totalImages - 8;

                                    return (
                                        <div
                                            className="gallery-bottom-item"
                                            key={index}
                                            onClick={() =>
                                                this.setState({
                                                    previewImage: image.image_url,
                                                    previewIndex: index
                                                })
                                            }
                                        >
                                            <img
                                                src={image.image_url}
                                                alt={`bottom-${index}`}
                                            />

                                            {/* Chỉ hiện ở ảnh cuối cùng nếu còn ảnh */}
                                            {index === 4 && remainImages > 0 && (
                                                <div className="more-images">
                                                    +{remainImages} ảnh
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Modal phóng to ảnh */}
                        {this.state.previewImage && (
                            <div
                                className="image-preview-modal"
                                onClick={() =>
                                    this.setState({
                                        previewImage: "",
                                        previewIndex: 0
                                    })
                                }
                            >
                                <div
                                    className="preview-content"
                                    onClick={(e) => e.stopPropagation()}
                                >

                                    {/* nút trái */}
                                    <button
                                        className="preview-arrow left"
                                        onClick={() => {
                                            let images = hotelDetail.hotelImages || [];
                                            let newIndex =
                                                this.state.previewIndex === 0
                                                    ? images.length - 1
                                                    : this.state.previewIndex - 1;

                                            this.setState({
                                                previewIndex: newIndex,
                                                previewImage: images[newIndex].image_url
                                            });
                                        }}
                                    >
                                        ‹
                                    </button>

                                    {/* ảnh lớn */}
                                    <img
                                        src={this.state.previewImage}
                                        alt="preview"
                                    />

                                    {/* nút phải */}
                                    <button
                                        className="preview-arrow right"
                                        onClick={() => {
                                            let images = hotelDetail.hotelImages || [];
                                            let newIndex =
                                                this.state.previewIndex === images.length - 1
                                                    ? 0
                                                    : this.state.previewIndex + 1;

                                            this.setState({
                                                previewIndex: newIndex,
                                                previewImage: images[newIndex].image_url
                                            });
                                        }}
                                    >
                                        ›
                                    </button>

                                </div>
                            </div>
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    <div className="hotel-description-box">
                        <h2>Trải nghiệm lưu trú tại {hotelDetail.name}</h2>

                        <p>
                            {
                                hotelDetail.description
                                    ?.split('\n')
                                    .map((line, index) => (
                                        <span key={index}>
                                            {line}
                                            <br />
                                        </span>
                                    ))
                            }
                        </p>
                    </div>

                    <div className="hotel-map-section">
                        <h2>Vị trí khách sạn</h2>

                        <div className="hotel-location">
                            <i className="fas fa-map-marker-alt"></i>
                            {hotelDetail.address}, {hotelDetail.city}
                        </div>

                        <div className="hotel-map">
                            <iframe
                                title="hotel-map"
                                src={`https://www.google.com/maps?q=${hotelDetail.address}, ${hotelDetail.city}&output=embed`}
                                width="100%"
                                height="420"
                                frameBorder="0"
                                style={{ border: 0 }}
                                allowFullScreen=""
                            />
                        </div>
                    </div>

                    {/* ROOM LIST */}
                    <div className="room-section">
                        <h2>Chọn phòng của bạn</h2>

                        <div className="room-list">
                            {rooms && rooms.length > 0 ? (
                                rooms.map((room) => {
                                    const image =
                                        room.roomImages?.[0]?.image_url ||
                                        "https://images.unsplash.com/photo-1566073771259-6a8506099945";

                                    return (
                                        <div className="room-card" key={room.id}
                                            onClick={() =>
                                                this.setState({
                                                    selectedRoom: room,
                                                    isOpenRoomModal: true
                                                })
                                            }
                                        >

                                            {/* ẢNH */}
                                            <div className="room-image">
                                                <img src={image} alt={room.room_type} />
                                            </div>

                                            {/* INFO */}
                                            <div className="room-info">
                                                <h3>{room.room_type}</h3>

                                                <div className="room-desc">
                                                    {room.bed_info || "1 giường đôi lớn"} • {room.size || 30} m²
                                                </div>

                                                {room.free_cancel && (
                                                    <div className="room-benefit green">
                                                        ✓ Miễn phí hủy phòng
                                                    </div>
                                                )}

                                                {room.pay_at_hotel && (
                                                    <div className="room-benefit green">
                                                        ✓ Không cần thanh toán trước
                                                    </div>
                                                )}

                                                {room.breakfast_included && (
                                                    <div className="room-benefit">
                                                        🍳 Bao gồm bữa sáng
                                                    </div>
                                                )}

                                                {/* <div className="room-status">
                                                        Trạng thái: {room.status}
                                                    </div> */}
                                            </div>

                                            {/* PRICE */}
                                            <div className="room-price-box">
                                                <div className="room-price">
                                                    {Number(room.price).toLocaleString("vi-VN")}đ
                                                </div>

                                                <div className="room-price-sub">
                                                    mỗi đêm
                                                </div>

                                                <button
                                                    className={`book-room-btn ${room.available_count <= 0 ? "disabled" : ""
                                                        }`}
                                                    disabled={room.available_count <= 0}
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        if (room.available_count <= 0) return;

                                                        this.setState({
                                                            bookingRoom: room,
                                                            isOpenBookingModal: true
                                                        });
                                                    }}
                                                >
                                                    {room.available_count > 0 ? "Đặt phòng" : "Hết phòng"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="no-data">Không có phòng nào</div>
                            )}
                        </div>
                    </div>

                    <div className="hotel-reviews">
                        <div className="reviews-header">
                            <h2>Đánh giá khách hàng</h2>
                            {reviews.length > 0 && (
                                <div className="review-filter">
                                    <span>Lọc:</span>
                                    {ratingOptions.map((rating) => (
                                        <button
                                            key={rating}
                                            className={`filter-btn ${reviewFilter === rating ? 'active' : ''}`}
                                            onClick={() => this.handleReviewFilter(rating)}
                                        >
                                            {rating === 0 ? 'Tất cả' : `${rating} ★`}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Overview + List */}
                        <div className="reviews-grid">
                            <div className="review-overview">
                                {(() => {
                                    const o = this.computeRatingOverview();
                                    const stars = Math.round(o.average || 0);

                                    return (
                                        <>
                                            <div className="overview-score">
                                                <div className="avg">{o.average || 0}</div>
                                                <div className="stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</div>
                                                <div className="total">{o.total} đánh giá</div>
                                            </div>

                                            <div className="rating-breakdown">
                                                {[5,4,3,2,1].map((star, idx) => {
                                                    const count = o.counts[idx] || 0;
                                                    const pct = o.total ? Math.round((count / o.total) * 100) : 0;
                                                    return (
                                                        <div className="rating-row" key={star}>
                                                            <div className="star-label">{star} ★</div>
                                                            <div className="bar">
                                                                <div className="bar-fill" style={{width: `${pct}%`}} />
                                                            </div>
                                                            <div className="count">{count}</div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </>
                                    )
                                })()}
                            </div>

                            <div className="review-list">
                                {filteredReviews.length === 0 ? (
                                    <div className="no-reviews">Chưa có đánh giá nào</div>
                                ) : (
                                    <>
                                        {visibleReviews.map((r) => (
                                            <div className="review-item" key={r.id}>
                                                <div className="review-header">
                                                    <strong>{r.userName || 'Người dùng'}</strong>
                                                    <span className="rating">{r.rating} ★</span>
                                                </div>
                                                <div className="review-body">{r.comment}</div>
                                                <div className="review-meta">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</div>
                                            </div>
                                        ))}

                                        {filteredReviews.length > 3 && (
                                            <button className="toggle-review-list" onClick={this.toggleShowAllReviews}>
                                                {showAllReviews
                                                    ? 'Ẩn bớt đánh giá'
                                                    : `Xem thêm ${filteredReviews.length - 3} đánh giá`}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {this.state.isOpenRoomModal && (
                        <RoomDetailModal
                            room={this.state.selectedRoom}
                            onClose={() =>
                                this.setState({
                                    isOpenRoomModal: false,
                                    selectedRoom: null
                                })
                            }
                            onBook={(room) => {
                                console.log("CALL FROM PARENT", room); // 🔥 phải xuất hiện

                                this.setState({
                                    isOpenRoomModal: false
                                });

                                setTimeout(() => {
                                    this.setState({
                                        bookingRoom: room,
                                        isOpenBookingModal: true
                                    });
                                }, 0);
                            }}
                        />
                    )}

                </div>
                {this.state.isOpenBookingModal && (
                    <BookingModal
                        room={this.state.bookingRoom}
                        onClose={() =>
                            this.setState({
                                isOpenBookingModal: false,
                                bookingRoom: null
                            })
                        }
                    />
                )}
            </div>
        );
    }
}

export default withRouter(HotelDetailPage);