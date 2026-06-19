// src/pages/HomePage/Banner/Banner.js

import React from "react";
import "./Banner.scss";

const Banner = () => {
    return (
        <div className="banner-container">
            <div className="banner-content">
                <h1>Tìm chỗ nghỉ tiếp theo của bạn</h1>
                <p>
                    Tìm ưu đãi khách sạn, homestay và resort với giá tốt nhất
                </p>

                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Bạn muốn đi đâu?"
                    />

                    <input
                        type="date"
                    />

                    <button>Tìm kiếm</button>
                </div>
            </div>
        </div>
    );
};

export default Banner;