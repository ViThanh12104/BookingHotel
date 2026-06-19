import React from "react";
import "./Footer.scss";

const Footer = () => {
    return (
        <div className="footer-container">

            <div className="footer-content">

                {/* COLUMN 1 */}
                <div className="footer-column">
                    <h3>Hỗ trợ</h3>

                    <p>Quản lí các chuyến đi của bạn</p>
                    <p>Liên hệ Dịch vụ Khách hàng</p>
                    <p>Trung tâm thông tin bảo mật</p>
                </div>

                {/* COLUMN 2 */}
                <div className="footer-column">
                    <h3>Khám phá thêm</h3>

                    <p>Chương trình khách hàng thân thiết Genius</p>
                    <p>Ưu đãi theo mùa và dịp lễ</p>
                    <p>Bài viết về du lịch</p>
                    <p>Booking.com dành cho Doanh Nghiệp</p>
                    <p>Traveller Review Awards</p>
                    <p>Cho thuê xe hơi</p>
                    <p>Tìm chuyến bay</p>
                    <p>Đặt nhà hàng</p>
                    <p>Booking.com dành cho Đại lý Du lịch</p>
                </div>

                {/* COLUMN 3 */}
                <div className="footer-column">
                    <h3>Điều khoản và cài đặt</h3>

                    <p>Chính sách Bảo mật</p>
                    <p>Điều khoản dịch vụ</p>
                    <p>Chính sách về Khả năng tiếp cận</p>
                    <p>Tranh chấp đối tác</p>
                    <p>Chính sách chống Nô lệ Hiện đại</p>
                    <p>Chính sách về Quyền con người</p>
                </div>

                {/* COLUMN 4 */}
                <div className="footer-column">
                    <h3>Dành cho đối tác</h3>

                    <p>Đăng nhập vào trang Extranet</p>
                    <p>Trợ giúp đối tác</p>
                    <p>Đăng chỗ nghỉ của Quý vị</p>
                    <p>Trở thành đối tác phân phối</p>
                </div>

                {/* COLUMN 5 */}
                <div className="footer-column">
                    <h3>Về chúng tôi</h3>

                    <p>Về Booking.com</p>
                    <p>Chúng tôi hoạt động như thế nào</p>
                    <p>Du lịch bền vững</p>
                    <p>Truyền thông</p>
                    <p>Cơ hội việc làm</p>
                    <p>Quan hệ cổ đông</p>
                    <p>Liên hệ công ty</p>
                    <p>Hướng dẫn và cáo báo nội dung</p>
                </div>

            </div>

            {/* BOTTOM */}
            <div className="footer-bottom">

                <div className="currency">
                    <img
                        src="https://flagcdn.com/w40/vn.png"
                        alt="vn"
                    />

                    <span>VND</span>
                </div>

            </div>

        </div>
    );
};

export default Footer;