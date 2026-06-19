
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import HomeHeader from "../HomeHeader";
import homeService from "../../../services/homeService";
import "./SearchPage.scss";

class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hotels: [],
            keyword: "",
            showSortDropdown: false,
            selectedSort: "Lựa chọn hàng đầu của chúng tôi",
            currentPage: 1,
            limit: 5,

            // FILTERS
            minPrice: 0,
            maxPrice: 999999999,

            filterFreeCancel: false,
            filterHighRating: false,
            filterHotelOnly: false,
            filterBreakfast: false,
            filterPayLater: false,
            filterLuxury: false
        };
    }

    async componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        const keyword = query.get("keyword");

        if (keyword) {
            this.setState({ keyword });
            await this.fetchSearchHotels(keyword);
        } else {
            await this.fetchAllHotels();
        }
        this.setState({
            minPrice: 0,
            maxPrice: 999999999
        });
    }
    async componentDidUpdate(prevProps) {

        if (
            prevProps.location.search !==
            this.props.location.search
        ) {

            const query = new URLSearchParams(
                this.props.location.search
            );

            const keyword = query.get("keyword");

            if (keyword) {

                this.setState({
                    keyword
                });

                await this.fetchSearchHotels(keyword);
            }
        }
    }


    fetchSearchHotels = async (keyword) => {
        try {
            let res = await homeService.searchHotels(keyword);

            if (res && res.errCode === 0) {
                this.setState({
                    hotels: res.hotels || [],
                    originalHotels: res.hotels || []
                });
            }
        } catch (e) {
            console.log("Search hotel error:", e);
        }
    };

    fetchAllHotels = async () => {
        try {
            let res = await homeService.getAllHotels();

            if (res && res.errCode === 0) {
                this.setState({
                    hotels: res.hotels || [],
                    originalHotels: res.hotels || []
                });
            }
        } catch (e) {
            console.log("Fetch all hotels error:", e);
        }
    };

    handleViewDetail = (hotelId) => {
        this.props.history.push(`/hotel-detail/${hotelId}`);
    };



    /* =========================
       TOGGLE DROPDOWN
    ========================= */

    toggleSortDropdown = () => {
        this.setState({
            showSortDropdown: !this.state.showSortDropdown
        });
    };

    /* =========================
       HANDLE SORT
    ========================= */

    handleSortSelect = (type) => {
        let { hotels } = this.state;
        let sortedHotels = [...hotels];

        switch (type) {
            case "Giá (ưu tiên thấp nhất)":
                sortedHotels.sort((a, b) => {
                    const priceA =
                        a.rooms && a.rooms.length > 0
                            ? Number(a.rooms[0].price)
                            : 9999999;

                    const priceB =
                        b.rooms && b.rooms.length > 0
                            ? Number(b.rooms[0].price)
                            : 9999999;

                    return priceA - priceB;
                });
                break;

            case "Giá (ưu tiên cao nhất)":
                sortedHotels.sort((a, b) => {
                    const priceA =
                        a.rooms && a.rooms.length > 0
                            ? Number(a.rooms[0].price)
                            : 0;

                    const priceB =
                        b.rooms && b.rooms.length > 0
                            ? Number(b.rooms[0].price)
                            : 0;

                    return priceB - priceA;
                });
                break;

            case "Được đánh giá hàng đầu":
                sortedHotels.sort((a, b) => {
                    return (b.rating || 0) - (a.rating || 0);
                });
                break;

            default:
                break;
        }

        this.setState({
            hotels: sortedHotels,
            selectedSort: type,
            showSortDropdown: false
        });
    };

    /* =========================
   HANDLE FILTER CHECKBOX
========================= */

    handleFilterChange = (name) => {
        this.setState(
            {
                [name]: !this.state[name]
            },
            () => {
                this.applyFilters();
            }
        );
    };

    /* =========================
       HANDLE PRICE FILTER
    ========================= */

    handlePriceFilter = (min, max) => {
        this.setState(
            {
                minPrice: min,
                maxPrice: max
            },
            () => {
                this.applyFilters();
            }
        );
    };

    /* =========================
       APPLY ALL FILTERS
    ========================= */

    applyFilters = () => {
        let {
            originalHotels,
            minPrice,
            maxPrice,
            filterFreeCancel,
            filterHighRating,
            filterHotelOnly,
            filterBreakfast,
            filterPayLater,
            filterLuxury
        } = this.state;

        let filteredHotels = [...originalHotels];

        /* =========================
           FILTER THEO GIÁ
        ========================= */

        filteredHotels = filteredHotels.filter((hotel) => {
            const roomPrice =
                hotel.rooms && hotel.rooms.length > 0
                    ? Number(hotel.rooms[0].price)
                    : 0;

            return roomPrice >= minPrice && roomPrice <= maxPrice;
        });

        /* =========================
           FILTER RATING TỐT (>= 4.0)
        ========================= */

        if (filterHighRating) {
            filteredHotels = filteredHotels.filter(
                (hotel) => Number(hotel.rating) >= 4
            );
        }

        /* =========================
           FILTER KHÁCH SẠN SANG TRỌNG (>= 4.5)
        ========================= */

        if (filterLuxury) {
            filteredHotels = filteredHotels.filter(
                (hotel) => Number(hotel.rating) >= 4.5
            );
        }

        /* =========================
           FILTER MIỄN PHÍ HỦY PHÒNG
        ========================= */

        if (filterFreeCancel) {
            filteredHotels = filteredHotels.filter(
                (hotel) =>
                    hotel.rooms &&
                    hotel.rooms.length > 0 &&
                    hotel.rooms[0].free_cancel === true
            );
        }

        /* =========================
           FILTER BAO GỒM BỮA SÁNG
        ========================= */

        if (filterBreakfast) {
            filteredHotels = filteredHotels.filter(
                (hotel) =>
                    hotel.rooms &&
                    hotel.rooms.length > 0 &&
                    hotel.rooms[0].breakfast_included === true
            );
        }

        /* =========================
           FILTER THANH TOÁN TẠI KS
        ========================= */

        if (filterPayLater) {
            filteredHotels = filteredHotels.filter(
                (hotel) =>
                    hotel.rooms &&
                    hotel.rooms.length > 0 &&
                    hotel.rooms[0].pay_at_hotel === true
            );
        }

        /* =========================
           FILTER CHỈ KHÁCH SẠN
        ========================= */

        if (filterHotelOnly) {
            filteredHotels = filteredHotels.filter(
                (hotel) => hotel.name
            );
        }

        this.setState({
            hotels: filteredHotels
        });
    };

    render() {
        const { hotels, city, currentPage, limit } = this.state;

        const start = (currentPage - 1) * limit;
        const end = start + limit;

        const currentHotels = hotels.slice(start, end);
        const totalPages = Math.ceil(hotels.length / limit);

        return (
            <div className="hotel-list-page">
                <HomeHeader />

                <div className="hotel-list-container">

                    {/* LEFT FILTER */}
                    <div className="hotel-filter-sidebar">

                        <div className="map-box">
                            <iframe
                                title="hotel-map"
                                src={`https://www.google.com/maps?q=${city}&output=embed`}
                                width="100%"
                                height="220"
                                frameBorder="0"
                                style={{ border: 0 }}
                                allowFullScreen=""
                            />

                            <button className="map-btn">
                                <i className="fas fa-map-marker-alt"></i>
                                Hiển thị trên bản đồ
                            </button>
                        </div>

                        <div className="filter-box">
                            <h3>Chọn lọc theo:</h3>

                            {/* PRICE FILTER */}

                            <div className="filter-item">
                                <h4>Ngân sách của bạn (mỗi đêm)</h4>

                                <label onClick={() => this.handlePriceFilter(0, 1000000)}>
                                    <input type="radio" name="price" />
                                    Dưới 1.000.000đ
                                </label>

                                <label onClick={() => this.handlePriceFilter(1000000, 2000000)}>
                                    <input type="radio" name="price" />
                                    1.000.000đ - 2.000.000đ
                                </label>

                                <label onClick={() => this.handlePriceFilter(2000000, 4000000)}>
                                    <input type="radio" name="price" />
                                    2.000.000đ - 4.000.000đ
                                </label>

                                <label onClick={() => this.handlePriceFilter(4000000, 999999999)}>
                                    <input type="radio" name="price" />
                                    Trên 4.000.000đ
                                </label>
                            </div>

                            {/* POPULAR FILTERS */}

                            <div className="filter-item">
                                <h4>Các bộ lọc phổ biến</h4>

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={this.state.filterHotelOnly}
                                        onChange={() =>
                                            this.handleFilterChange("filterHotelOnly")
                                        }
                                    />
                                    Khách sạn
                                </label>

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={this.state.filterFreeCancel}
                                        onChange={() =>
                                            this.handleFilterChange("filterFreeCancel")
                                        }
                                    />
                                    Miễn phí hủy phòng
                                </label>

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={this.state.filterHighRating}
                                        onChange={() =>
                                            this.handleFilterChange("filterHighRating")
                                        }
                                    />
                                    Được đánh giá tốt
                                </label>

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={this.state.filterBreakfast}
                                        onChange={() =>
                                            this.handleFilterChange("filterBreakfast")
                                        }
                                    />
                                    Bao gồm bữa sáng
                                </label>

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={this.state.filterPayLater}
                                        onChange={() =>
                                            this.handleFilterChange("filterPayLater")
                                        }
                                    />
                                    Không cần thanh toán trước
                                </label>

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={this.state.filterLuxury}
                                        onChange={() =>
                                            this.handleFilterChange("filterLuxury")
                                        }
                                    />
                                    Khách sạn sang trọng
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="hotel-main-content">

                        <div className="hotel-top-bar">
                            <h2>
                                Kết quả tìm kiếm: {this.state.keyword}
                            </h2>
                            <div className="sort-box">
                                <button
                                    className="sort-btn"
                                    onClick={this.toggleSortDropdown}
                                >
                                    <i className="fas fa-sort-amount-down"></i>

                                    Sắp xếp theo: {this.state.selectedSort}

                                    <i className="fas fa-chevron-down"></i>
                                </button>

                                {this.state.showSortDropdown && (
                                    <div className="sort-dropdown">

                                        <div
                                            className="sort-item"
                                            onClick={() =>
                                                this.handleSortSelect(
                                                    "Lựa chọn hàng đầu của chúng tôi"
                                                )
                                            }
                                        >
                                            Lựa chọn hàng đầu của chúng tôi
                                        </div>

                                        <div
                                            className="sort-item"
                                            onClick={() =>
                                                this.handleSortSelect(
                                                    "Giá (ưu tiên thấp nhất)"
                                                )
                                            }
                                        >
                                            Giá (ưu tiên thấp nhất)
                                        </div>

                                        <div
                                            className="sort-item"
                                            onClick={() =>
                                                this.handleSortSelect(
                                                    "Giá (ưu tiên cao nhất)"
                                                )
                                            }
                                        >
                                            Giá (ưu tiên cao nhất)
                                        </div>

                                        <div
                                            className="sort-item"
                                            onClick={() =>
                                                this.handleSortSelect(
                                                    "Được đánh giá hàng đầu"
                                                )
                                            }
                                        >
                                            Được đánh giá hàng đầu
                                        </div>

                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="hotel-result-list">
                            {hotels && hotels.length > 0 ? (
                                currentHotels.map((item, index) => {
                                    return (
                                        <div
                                            className="booking-card"
                                            key={item.id}
                                        >
                                            {/* IMAGE */}
                                            <div className="booking-image">
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

                                            {/* CONTENT */}
                                            <div className="booking-content">

                                                <div className="booking-left">
                                                    <h3>{item.name}</h3>

                                                    <p className="hotel-link">
                                                        {item.address}, {item.city}
                                                    </p>

                                                    <p className="distance">
                                                        Cách trung tâm {((Math.random() * 3) + 0.5).toFixed(1)} km
                                                    </p>

                                                    <div className="green-tag">
                                                        Ưu đãi du lịch
                                                    </div>

                                                    {/* ROOM TYPE từ database */}
                                                    <div className="room-title">
                                                        {
                                                            item.rooms &&
                                                                item.rooms.length > 0
                                                                ? item.rooms[0].room_type
                                                                : "Phòng Deluxe"
                                                        }
                                                    </div>

                                                    {/* BED INFO + SIZE từ database */}
                                                    <div className="room-desc">
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
                                                            <div className="pay-later">
                                                                ✓ Miễn phí hủy phòng
                                                            </div>
                                                        )
                                                    }

                                                    {/* BREAKFAST */}
                                                    {
                                                        item.rooms &&
                                                        item.rooms.length > 0 &&
                                                        item.rooms[0].breakfast_included && (
                                                            <div className="pay-later">
                                                                ✓ Bao gồm bữa sáng
                                                            </div>
                                                        )
                                                    }

                                                    {/* PAY AT HOTEL */}
                                                    {
                                                        item.rooms &&
                                                        item.rooms.length > 0 &&
                                                        item.rooms[0].pay_at_hotel && (
                                                            <div className="pay-later">
                                                                ✓ Không cần thanh toán trước
                                                            </div>
                                                        )
                                                    }

                                                    {/* AVAILABLE COUNT */}
                                                    <div className="last-room">
                                                        {
                                                            item.rooms &&
                                                                item.rooms.length > 0
                                                                ? `Chúng tôi còn ${item.rooms[0].available_count || 1} phòng với giá này`
                                                                : "Chúng tôi còn 1 phòng với giá này"
                                                        }
                                                    </div>
                                                </div>

                                                <div className="booking-right">
                                                    <div className="review-box">
                                                        <div>
                                                            <p className="review-text">
                                                                {
                                                                    Number(item.rating) >= 4.5
                                                                        ? "Tuyệt vời"
                                                                        : Number(item.rating) >= 4
                                                                            ? "Rất tốt"
                                                                            : Number(item.rating) >= 3.5
                                                                                ? "Tốt"
                                                                                : "Ổn"
                                                                }
                                                            </p>

                                                            <p className="review-count">
                                                                {
                                                                    item.reviews
                                                                        ? `${item.reviews.length} đánh giá`
                                                                        : "0 đánh giá"
                                                                }
                                                            </p>
                                                        </div>

                                                        <div className="review-score">
                                                            {
                                                                item.rating
                                                                    ? Number(item.rating).toFixed(1)
                                                                    : "4.5"
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="price-box">
                                                        <div className="old-price">
                                                            {
                                                                (() => {
                                                                    const currentPrice =
                                                                        item.rooms && item.rooms.length > 0
                                                                            ? Number(item.rooms[0].price)
                                                                            : 1500000;

                                                                    // giá cũ random cao hơn giá hiện tại từ 300k → 1tr
                                                                    const oldPrice =
                                                                        currentPrice +
                                                                        Math.floor(Math.random() * 700000 + 300000);

                                                                    return `VND ${oldPrice.toLocaleString("vi-VN")}`;
                                                                })()
                                                            }
                                                        </div>

                                                        <div className="new-price">
                                                            {
                                                                item.rooms && item.rooms.length > 0
                                                                    ? Number(item.rooms[0].price).toLocaleString("vi-VN")
                                                                    : "1.500.000"
                                                            }đ
                                                        </div>

                                                        <div className="price-sub">
                                                            + thuế và phí
                                                        </div>
                                                    </div>

                                                    <button
                                                        className="view-room-btn"
                                                        onClick={() =>
                                                            this.handleViewDetail(item.id)
                                                        }
                                                    >
                                                        Xem chỗ trống
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="no-data">
                                    Không tìm thấy khách sạn nào
                                </div>
                            )}
                        </div>
                        <div className="pagination">
                            <button
                                disabled={currentPage === 1}
                                onClick={() =>
                                    this.setState({ currentPage: currentPage - 1 })
                                }
                            >
                                ←
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={currentPage === i + 1 ? "active" : ""}
                                    onClick={() =>
                                        this.setState({ currentPage: i + 1 })
                                    }
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    this.setState({ currentPage: currentPage + 1 })
                                }
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(SearchPage);