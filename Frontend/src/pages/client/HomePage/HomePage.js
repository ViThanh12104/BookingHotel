import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';

import { withRouter } from "react-router-dom";

import HomeHeader from '../HomeHeader';
import Footer from '../../../components/Footer/Footer';

import homeService from '../../../services/homeService';
import './HomePage.scss';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hotels: [],
            cities: []
        };
        this.cityScrollRef = createRef();
    }

    async componentDidMount() {
        await this.fetchAllHotels();
    }

    fetchAllHotels = async () => {
        try {
            let res = await homeService.getAllHotels();

            if (res && res.errCode === 0) {
                let hotels = res.hotels || [];

                let uniqueCities = [
                    ...new Set(hotels.map(item => item.city))
                ];

                this.setState({
                    hotels: hotels,
                    cities: uniqueCities
                });
            }
        } catch (e) {
            console.log("Fetch hotels error: ", e);
        }
    };

    scrollLeft = () => {
        if (this.cityScrollRef.current) {
            this.cityScrollRef.current.scrollBy({
                left: -320,
                behavior: "smooth"
            });
        }
    };

    scrollRight = () => {
        if (this.cityScrollRef.current) {
            this.cityScrollRef.current.scrollBy({
                left: 320,
                behavior: "smooth"
            });
        }
    };

    handleClickCity = (city) => {
        this.props.history.push(`/hotels-city?city=${city}`);
    };
    handleViewDetail = (hotelId) => {
        this.props.history.push(`/hotel-detail/${hotelId}`);
    };


    render() {
        const { hotels, cities } = this.state;

        const cityImages = {
            "Hà Nội":
                "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a",

            "Ninh Bình":
                "https://images.unsplash.com/photo-1528127269322-539801943592",

            "Huế":
                "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a",

            "Hội An":
                "https://images.unsplash.com/photo-1539650116574-75c0c6d73f0e",

            "TP Hồ Chí Minh":
                "https://images.unsplash.com/photo-1583417319070-4a69db38a482",

            "Đà Nẵng":
                "https://images.unsplash.com/photo-1528127269322-539801943592",

            "Sa Pa":
                "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b",

            "Nha Trang":
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",

            "Cần Thơ":
                "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",

            "Phú Quốc":
                "https://images.unsplash.com/photo-1473116763249-2faaef81ccda"
        };

        return (
            <div className="homepage-container">
                <HomeHeader />

                {/* ===== CITY SECTION ===== */}

                <div className="city-section">
                    <h2 className="section-title">
                        Khám phá Việt Nam
                    </h2>

                    <div className="city-subtitle">
                        Các điểm đến phổ biến này có nhiều điều chờ đón bạn
                    </div>

                    <div className="city-wrapper">

                        <button
                            className="scroll-btn left"
                            onClick={this.scrollLeft}
                        >
                            ‹
                        </button>

                        <div
                            className="city-list-scroll"
                            ref={this.cityScrollRef}
                        >
                            {cities && cities.length > 0 ? (
                                cities.map((city, index) => {
                                    let cityImage =
                                        cityImages[city] ||
                                        "https://upload.wikimedia.org/wikipedia/commons/0/08/Ha_Long_Bay_in_Vietnam.jpg";

                                    return (
                                        <div
                                            className="city-card"
                                            key={index}
                                            onClick={() => this.handleClickCity(city)}
                                        >
                                            <div className="city-image">
                                                <img
                                                    src={cityImage}
                                                    alt={city}
                                                />
                                            </div>

                                            <div className="city-name">
                                                {city}
                                            </div>

                                            <div className="city-count">
                                                {
                                                    hotels.filter(
                                                        (hotel) => hotel.city === city
                                                    ).length
                                                } chỗ nghỉ
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div>
                                    Không có thành phố
                                </div>
                            )}
                        </div>

                        <button
                            className="scroll-btn right"
                            onClick={this.scrollRight}
                        >
                            ›
                        </button>

                    </div>
                </div>

                {/* ===== HOTEL LIST ===== */}

                <div className="hotel-list-section">
                    <h2 className="section-title">
                        Chỗ nghỉ nổi bật dành cho bạn
                    </h2>

                    <div className="hotel-subtitle">
                        Những khách sạn được yêu thích nhất tại Việt Nam
                    </div>

                    <div className="hotel-list">
                        {hotels && hotels.length > 0 ? (
                            [...hotels]
                                .sort(() => Math.random() - 0.5)
                                .slice(0, 6)
                                .map((item) => {
                                    return (
                                        <div
                                            className="hotel-card"
                                            key={item.id}
                                            onClick={() =>
                                                this.handleViewDetail(item.id)
                                            }
                                        >
                                            <div className="hotel-image">
                                                <img
                                                    src={
                                                        item.thumbnail &&
                                                            item.thumbnail.length > 0
                                                            ? item.thumbnail
                                                            : "https://images.unsplash.com/photo-1566073771259-6a8506099945"
                                                    }
                                                    alt={item.name}
                                                />
                                            </div>


                                            <div className="hotel-info">
                                                <div className="hotel-top">
                                                    <h3>{item.name}</h3>

                                                    <div className="hotel-rating">
                                                        {
                                                            item.rating
                                                                ? Number(item.rating).toFixed(1)
                                                                : "4.5"
                                                        }
                                                        <i className="fas fa-star"></i>
                                                    </div>
                                                </div>

                                                <p className="hotel-city">
                                                    {item.city}
                                                </p>

                                                <p className="hotel-address">
                                                    {item.address}
                                                </p>

                                                {/* ROOM TYPE */}
                                                <div className="hotel-room-type">
                                                    {
                                                        item.rooms &&
                                                            item.rooms.length > 0
                                                            ? item.rooms[0].room_type
                                                            : "Phòng Deluxe"
                                                    }
                                                </div>

                                                {/* BED INFO + SIZE */}
                                                <div className="hotel-room-desc">
                                                    {
                                                        item.rooms &&
                                                            item.rooms.length > 0
                                                            ? `${item.rooms[0].bed_info || "1 giường đôi lớn"} • ${item.rooms[0].size || "30m²"}`
                                                            : "1 giường đôi lớn • 30m²"
                                                    }
                                                </div>

                                                {/* FREE CANCEL */}
                                                {
                                                    item.rooms &&
                                                    item.rooms.length > 0 &&
                                                    item.rooms[0].free_cancel && (
                                                        <div className="hotel-tag">
                                                            ✓ Miễn phí hủy phòng
                                                        </div>
                                                    )
                                                }

                                                {/* BREAKFAST */}
                                                {
                                                    item.rooms &&
                                                    item.rooms.length > 0 &&
                                                    item.rooms[0].breakfast_included && (
                                                        <div className="hotel-tag">
                                                            ✓ Bao gồm bữa sáng
                                                        </div>
                                                    )
                                                }

                                                {/* PAY AT HOTEL */}
                                                {
                                                    item.rooms &&
                                                    item.rooms.length > 0 &&
                                                    item.rooms[0].pay_at_hotel && (
                                                        <div className="hotel-tag">
                                                            ✓ Không cần thanh toán trước
                                                        </div>
                                                    )
                                                }

                                                {/* AVAILABLE COUNT */}
                                                <div className="hotel-last-room">
                                                    {
                                                        item.rooms &&
                                                            item.rooms.length > 0
                                                            ? `Còn ${item.rooms[0].available_count || 1} phòng`
                                                            : "Còn 1 phòng"
                                                    }
                                                </div>

                                                {/* PRICE */}
                                                <div className="hotel-page-price">
                                                    Từ{" "}
                                                    <strong>
                                                        {
                                                            item.rooms &&
                                                                item.rooms.length > 0
                                                                ? Number(item.rooms[0].price).toLocaleString("vi-VN")
                                                                : "Liên hệ"
                                                        }đ
                                                    </strong>{" "}
                                                    / đêm
                                                </div>

                                                <button className="view-btn">
                                                    Xem chi tiết
                                                </button>
                                            </div>
                                        </div>

                                    );
                                })
                        ) : (
                            <div className="no-data">
                                Không có khách sạn nào
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }


}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

export default withRouter(
    connect(mapStateToProps)(HomePage)
);
