import React, { Component } from "react";

import {
    FaWifi, FaTv, FaSnowflake, FaBath, FaBed,
    FaLock, FaPhone, FaPlug, FaUtensils,
    FaCoffee, FaSwimmingPool, FaDumbbell, FaCheck, FaCity
} from "react-icons/fa";

import "./RoomDetailModal.scss";

class RoomDetailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        };
    }

    // reset index khi đổi phòng
    componentDidUpdate(prevProps) {
        if (prevProps.room !== this.props.room) {
            this.setState({ index: 0 });
        }
    }

    getImages = () => {
        const { room } = this.props;

        return (room?.roomImages || [])
            .filter(img => img && img.image_url);
    };

    changeImage = (step) => {
        const images = this.getImages();
        if (images.length === 0) return;

        let newIndex = this.state.index + step;

        if (newIndex < 0) newIndex = images.length - 1;
        if (newIndex >= images.length) newIndex = 0;

        this.setState({ index: newIndex });
    };
    splitTo2Cols = (arr) => {
        const half = Math.ceil(arr.length / 2);
        return [arr.slice(0, half), arr.slice(half)];
    };
    getAmenitiesByLevel = () => {
        const { room } = this.props;

        const level =
            room.price >= 2500000 ? 3 :
                room.price >= 1500000 ? 2 : 1;

        const data = {
            room: [
                "wifi", "tv", "air", "bed", "desk", "wardrobe"
            ],
            bathroom: [
                "bathtub", "hairdryer", "toiletries", "hotwater"
            ],
            service: [
                "restaurant", "pool", "gym"
            ],
            view: [
                "city"
            ]
        };

        if (level >= 2) {
            data.room.push("minibar", "kettle", "safe", "slippers");
            data.service.push("spa", "bar");
            data.view.push("poolview");
        }

        if (level === 3) {
            data.room.push("coffee", "soundproof");
            data.service.push("airport", "laundry");
            data.view.push("sea");
        }

        return data;
    };


    render() {
        const { room, onClose } = this.props;
        const { index } = this.state;

        const AMENITY_MAP = {
            wifi: { icon: <FaWifi />, label: "Wifi miễn phí" },
            tv: { icon: <FaTv />, label: "TV màn hình phẳng" },
            air: { icon: <FaSnowflake />, label: "Điều hòa" },
            bed: { icon: <FaBed />, label: "Giường thoải mái" },

            minibar: { icon: <FaCoffee />, label: "Minibar" },
            kettle: { icon: <FaCoffee />, label: "Ấm đun nước" },
            coffee: { icon: <FaCoffee />, label: "Máy pha cà phê" },

            safe: { icon: <FaLock />, label: "Két an toàn" },
            desk: { icon: <FaCheck />, label: "Bàn làm việc" },
            wardrobe: { icon: <FaCheck />, label: "Tủ quần áo" },
            slippers: { icon: <FaCheck />, label: "Dép" },
            soundproof: { icon: <FaCheck />, label: "Cách âm" },

            phone: { icon: <FaPhone />, label: "Điện thoại" },
            plug: { icon: <FaPlug />, label: "Ổ cắm gần giường" },

            hairdryer: { icon: <FaCheck />, label: "Máy sấy tóc" },
            toiletries: { icon: <FaCheck />, label: "Đồ vệ sinh miễn phí" },
            hotwater: { icon: <FaCheck />, label: "Nước nóng 24h" },
            mirror: { icon: <FaCheck />, label: "Gương lớn" },

            bathtub: { icon: <FaBath />, label: "Bồn tắm" },

            pool: { icon: <FaSwimmingPool />, label: "Hồ bơi" },
            gym: { icon: <FaDumbbell />, label: "Phòng gym" },
            restaurant: { icon: <FaUtensils />, label: "Nhà hàng" },
            bar: { icon: <FaCheck />, label: "Quầy bar" },
            spa: { icon: <FaCheck />, label: "Spa" },
            airport: { icon: <FaCheck />, label: "Đưa đón sân bay" },
            laundry: { icon: <FaCheck />, label: "Giặt ủi" },

            city: { icon: <FaCity />, label: "Nhìn ra thành phố" },
            poolview: { icon: <FaSwimmingPool />, label: "Nhìn ra hồ bơi" },
            sea: { icon: <FaCheck />, label: "Nhìn ra biển" }
        };


        if (!room) return null;

        const images = this.getImages();

        const fallback =
            "https://images.unsplash.com/photo-1566073771259-6a8506099945";

        const mainImage =
            images.length > 0
                ? images[index]?.image_url
                : fallback;


        const amenities = this.getAmenitiesByLevel();


        return (

            <div className="room-modal" onClick={onClose}>
                <div
                    className="room-modal-container"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* CLOSE */}
                    <div className="modal-close" onClick={onClose}>
                        ×
                    </div>

                    <div className="modal-body">

                        {/* LEFT IMAGE */}
                        <div className="modal-left">

                            <div className="main-image">
                                <img
                                    src={mainImage}
                                    alt="room"
                                    onError={(e) => (e.target.src = fallback)}
                                />

                                {images.length > 1 && (
                                    <>
                                        <button
                                            className="nav left"
                                            onClick={() => this.changeImage(-1)}
                                        >
                                            ‹
                                        </button>

                                        <button
                                            className="nav right"
                                            onClick={() => this.changeImage(1)}
                                        >
                                            ›
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* THUMBNAILS */}
                            {images.length > 1 && (
                                <div className="thumb-list">
                                    {images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img.image_url}
                                            alt="thumb"
                                            className={i === index ? "active" : ""}
                                            onClick={() =>
                                                this.setState({ index: i })
                                            }
                                            onError={(e) =>
                                                (e.target.src = fallback)
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT INFO */}
                        <div className="modal-right">

                            <h2>{room.room_type}</h2>

                            {/* TAGS */}
                            <div className="tags">
                                <span>📏 {room.size || 30} m²</span>
                                <span>🛏 {room.bed_info || "1 giường lớn"}</span>
                                {room.free_cancel && <span>✔ Miễn phí hủy</span>}
                                {room.breakfast_included && <span>🍳 Bữa sáng</span>}
                                {room.pay_at_hotel && <span>💳 Trả tại KS</span>}
                            </div>

                            {/* TIỆN NGHI PHÒNG */}
                            <div className="section">
                                <h4>Tiện nghi phòng</h4>

                                <div className="amenities-grid">
                                    {this.splitTo2Cols(amenities.room).map((col, i) => (
                                        <ul key={i} className="icon-list">
                                            {col.map((item, idx) => (
                                                <li key={idx}>
                                                    {AMENITY_MAP[item]?.icon}
                                                    <span>{AMENITY_MAP[item]?.label}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ))}
                                </div>
                            </div>

                            {/* PHÒNG TẮM */}
                            <div className="section">
                                <h4>Phòng tắm</h4>

                                <div className="amenities-grid">
                                    {this.splitTo2Cols(amenities.bathroom).map((col, i) => (
                                        <ul key={i} className="icon-list">
                                            {col.map((item, idx) => (
                                                <li key={idx}>
                                                    {AMENITY_MAP[item]?.icon}
                                                    <span>{AMENITY_MAP[item]?.label}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ))}
                                </div>
                            </div>

                            {/* DỊCH VỤ */}
                            <div className="section">
                                <h4>Dịch vụ & tiện ích</h4>

                                <div className="amenities-grid">
                                    {this.splitTo2Cols(amenities.service).map((col, i) => (
                                        <ul key={i} className="icon-list">
                                            {col.map((item, idx) => (
                                                <li key={idx}>
                                                    {AMENITY_MAP[item]?.icon}
                                                    <span>{AMENITY_MAP[item]?.label}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ))}
                                </div>
                            </div>

                            {/* TẦM NHÌN */}
                            <div className="section">
                                <h4>Tầm nhìn</h4>

                                <div className="amenities-grid">
                                    {this.splitTo2Cols(amenities.view).map((col, i) => (
                                        <ul key={i} className="icon-list">
                                            {col.map((item, idx) => (
                                                <li key={idx}>
                                                    {AMENITY_MAP[item]?.icon}
                                                    <span>{AMENITY_MAP[item]?.label}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ))}
                                </div>
                            </div>

                            {/* GIÁ */}
                            <div className="price-box">
                                <div className="price">
                                    {Number(room.price).toLocaleString("vi-VN")}đ
                                </div>
                                <div className="sub">mỗi đêm</div>

                                <button
                                    className="book-btn"
                                    onClick={() => {
                                        console.log("CLICK BOOK BUTTON");
                                        if (this.props.onBook) {
                                            
                                            this.props.onBook(room);
                                        }
                                    }}
                                >
                                    Đặt phòng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RoomDetailModal;