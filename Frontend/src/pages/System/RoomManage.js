import React, { Component } from 'react';
import Header from '../../components/Header/Header';
import Swal from "sweetalert2";
import socket from '../../utils/socket';

import './RoomManage.scss';

import adminService from '../../services/adminService';

class RoomManage extends Component {

    state = {
        hotels: [],
        selectedHotel: "",
        rooms: [],
        searchRoom: "",
        currentPage: 1,
        limit: 8,
        isOpenModal: false,
        modalMode: "add",
        currentRoom: {},
        roomImages: [],
        form: {
            hotel_id: "",
            room_type: "",
            price: "",
            bed_info: "",
            size: "",
            free_cancel: true,
            breakfast_included: false,
            pay_at_hotel: true,
            available_count: ""
        }
    };

    async componentDidMount() {
        await this.getAllHotels();
        this.registerSocketListeners();
    }

    componentWillUnmount() {
        if (!socket) return;

        socket.off("roomAvailabilityUpdated", this.handleRoomAvailabilityUpdated);
        socket.off("bookingCreated", this.handleRoomBookingEvent);
        socket.off("bookingUpdated", this.handleRoomBookingEvent);
    }

    registerSocketListeners = () => {
        if (!socket) return;

        socket.on("roomAvailabilityUpdated", this.handleRoomAvailabilityUpdated);
        socket.on("bookingCreated", this.handleRoomBookingEvent);
        socket.on("bookingUpdated", this.handleRoomBookingEvent);
    };

    handleRoomAvailabilityUpdated = (event) => {
        if (!event) return;

        this.setState((prevState) => ({
            rooms: prevState.rooms.map((room) => {
                if (room.id === event.roomId) {
                    return {
                        ...room,
                        available_count: event.availableCount
                    };
                }
                return room;
            })
        }));
    };

    handleRoomBookingEvent = async (event) => {
        if (!event || !this.state.selectedHotel) return;

        await this.getRoomsByHotel(this.state.selectedHotel);
    };

    getAllHotels = async () => {
        try {
            let res = await adminService.getAllHotels();

            if (res && res.errCode === 0) {
                const hotels = res.hotels || [];

                this.setState({
                    hotels: hotels
                });

                if (hotels.length > 0) {
                    const firstHotelId = hotels[0].id.toString();

                    this.setState({
                        selectedHotel: firstHotelId,
                        form: {
                            ...this.state.form,
                            hotel_id: firstHotelId
                        }
                    });

                    await this.getRoomsByHotel(firstHotelId);
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    getRoomsByHotel = async (hotelId) => {
        if (!hotelId) {
            this.setState({
                selectedHotel: "",
                rooms: [],
                currentPage: 1
            });
            return;
        }

        try {
            let res = await adminService.adminGetRoomsByHotel(hotelId);

            if (res && res.errCode === 0) {
                this.setState({
                    rooms: res.rooms || [],
                    currentPage: 1
                });
            }
        } catch (e) {
            console.log(e);
        }
    };

    buildEmptyForm = () => ({
        hotel_id: this.state.selectedHotel,
        room_type: "",
        price: "",
        bed_info: "",
        size: "",
        free_cancel: true,
        breakfast_included: false,
        pay_at_hotel: true,
        available_count: ""
    });

    openAddModal = () => {
        if (!this.state.selectedHotel) {
            Swal.fire({
                icon: "warning",
                title: "Chọn khách sạn",
                text: "Vui lòng chọn khách sạn trước khi thêm phòng."
            });
            return;
        }

        this.setState({
            isOpenModal: true,
            modalMode: "add",
            currentRoom: {},
            roomImages: [],
            form: this.buildEmptyForm()
        });
    };

    openEditModal = (room) => {
        this.setState({
            isOpenModal: true,
            modalMode: "edit",
            currentRoom: room,
            roomImages: room.roomImages || [],
            form: {
                hotel_id: room.hotel_id || this.state.selectedHotel,
                room_type: room.room_type || "",
                price: room.price || "",
                bed_info: room.bed_info || "",
                size: room.size || "",
                free_cancel: !!room.free_cancel,
                breakfast_included: !!room.breakfast_included,
                pay_at_hotel: !!room.pay_at_hotel,
                available_count: room.available_count || ""
            }
        });
    };

    closeModal = () => {
        this.setState({
            isOpenModal: false,
            modalMode: "add",
            currentRoom: {},
            roomImages: [],
            form: this.buildEmptyForm()
        });
    };

    handleChangeForm = (event, field) => {
        const target = event.target;
        const value =
            target.type === "checkbox"
                ? target.checked
                : target.value;

        this.setState({
            form: {
                ...this.state.form,
                [field]: value
            }
        });
    };

    handleChooseRoomImages = (event) => {
        const files = Array.from(event.target.files);

        if (!files.length) {
            return;
        }

        this.setState({
            roomImages: files.map((file) => ({
                file: file,
                preview: URL.createObjectURL(file)
            }))
        });
    };

    validateRoomForm = () => {
        const {
            hotel_id,
            room_type,
            price,
            available_count
        } = this.state.form;

        if (!hotel_id || !room_type || !price || available_count === "") {
            Swal.fire({
                icon: "warning",
                title: "Thiếu dữ liệu",
                text: "Vui lòng nhập đầy đủ khách sạn, loại phòng, giá và số lượng."
            });
            return false;
        }

        if (Number(price) < 0 || Number(available_count) < 0) {
            Swal.fire({
                icon: "warning",
                title: "Dữ liệu không hợp lệ",
                text: "Giá và số lượng phải lớn hơn hoặc bằng 0."
            });
            return false;
        }

        return true;
    };

    handleSaveRoom = async () => {
        if (!this.validateRoomForm()) {
            return;
        }

        const data = {
            ...this.state.form,
            hotel_id: Number(this.state.form.hotel_id),
            price: Number(this.state.form.price),
            available_count: Number(this.state.form.available_count)
        };

        let formData = new FormData();

        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        this.state.roomImages.forEach((item) => {
            if (item.file) {
                formData.append("roomImages", item.file);
            }
        });

        try {
            let res;

            if (this.state.modalMode === "edit") {
                formData.append("id", this.state.currentRoom.id);
                res = await adminService.editRoom(formData);
            } else {
                res = await adminService.createRoom(formData);
            }

            if (res && res.errCode === 0) {
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text:
                        this.state.modalMode === "edit"
                            ? "Cập nhật phòng thành công!"
                            : "Tạo phòng thành công!"
                });

                const hotelId = data.hotel_id.toString();

                this.setState({
                    selectedHotel: hotelId
                });

                this.closeModal();
                await this.getRoomsByHotel(hotelId);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi...",
                    text: res?.errMessage || "Lưu phòng thất bại!"
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
    };

    handleDeleteRoom = async (room) => {
        if (!room || !room.id) {
            return;
        }

        const result = await Swal.fire({
            icon: "warning",
            title: "Xóa phòng?",
            text: `Phòng "${room.room_type}" sẽ bị xóa.`,
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            confirmButtonColor: "#ef4444"
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const nextTotal =
                Math.max(
                    this.state.rooms.length - 1,
                    0
                );

            let res = await adminService.deleteRoom(room.id);

            if (res && res.errCode === 0) {
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: "Xóa phòng thành công!"
                });

                await this.getRoomsByHotel(this.state.selectedHotel);

                const maxPage =
                    Math.max(
                        1,
                        Math.ceil(nextTotal / this.state.limit)
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
                    text: res?.errMessage || "Xóa phòng thất bại!"
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
    };

    renderRoomModal = () => {
        const { isOpenModal, modalMode, hotels, form, roomImages } = this.state;

        if (!isOpenModal) {
            return null;
        }

        return (
            <div className="room-modal-overlay">
                <div className="room-modal-container">
                    <div className="room-modal-header">
                        <h3>
                            {modalMode === "edit" ? "Chỉnh sửa phòng" : "Thêm phòng"}
                        </h3>

                        <span
                            className="room-modal-close"
                            onClick={this.closeModal}
                        >
                            &times;
                        </span>
                    </div>

                    <div className="room-modal-body">
                        <div className="room-form-grid">
                            <div className="room-form-group">
                                <label>Khách sạn</label>
                                <select
                                    value={form.hotel_id}
                                    onChange={(e) =>
                                        this.handleChangeForm(e, "hotel_id")
                                    }
                                >
                                    <option value="">Chọn khách sạn</option>
                                    {hotels.map((hotel) => (
                                        <option key={hotel.id} value={hotel.id}>
                                            {hotel.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="room-form-group">
                                <label>Loại phòng</label>
                                <input
                                    type="text"
                                    value={form.room_type}
                                    onChange={(e) =>
                                        this.handleChangeForm(e, "room_type")
                                    }
                                />
                            </div>

                            <div className="room-form-group">
                                <label>Giá</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.price}
                                    onChange={(e) =>
                                        this.handleChangeForm(e, "price")
                                    }
                                />
                            </div>

                            <div className="room-form-group">
                                <label>Số lượng</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.available_count}
                                    onChange={(e) =>
                                        this.handleChangeForm(e, "available_count")
                                    }
                                />
                            </div>

                            <div className="room-form-group">
                                <label>Thông tin giường</label>
                                <input
                                    type="text"
                                    value={form.bed_info}
                                    onChange={(e) =>
                                        this.handleChangeForm(e, "bed_info")
                                    }
                                />
                            </div>

                            <div className="room-form-group">
                                <label>Kích thước</label>
                                <input
                                    type="text"
                                    value={form.size}
                                    onChange={(e) =>
                                        this.handleChangeForm(e, "size")
                                    }
                                />
                            </div>
                        </div>

                        <div className="room-form-group room-image-upload">
                            <label>Ảnh phòng</label>
                            <label
                                htmlFor="roomImages"
                                className="room-upload-btn"
                            >
                                Tải ảnh
                            </label>

                            <input
                                hidden
                                multiple
                                id="roomImages"
                                type="file"
                                accept="image/*"
                                onChange={this.handleChooseRoomImages}
                            />

                            <div className="room-image-preview-list">
                                {roomImages.map((item, index) => (
                                    <img
                                        key={index}
                                        src={
                                            item.preview
                                                ? item.preview
                                                : item.image_url
                                        }
                                        alt="room preview"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="room-option-row">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={form.free_cancel}
                                    onChange={(e) =>
                                        this.handleChangeForm(e, "free_cancel")
                                    }
                                />
                                Hủy miễn phí
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={form.breakfast_included}
                                    onChange={(e) =>
                                        this.handleChangeForm(e, "breakfast_included")
                                    }
                                />
                                Bao gồm bữa sáng
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={form.pay_at_hotel}
                                    onChange={(e) =>
                                        this.handleChangeForm(e, "pay_at_hotel")
                                    }
                                />
                                Thanh toán khi nhận phòng
                            </label>
                        </div>
                    </div>

                    <div className="room-modal-footer">
                        <button
                            className="save-room-btn"
                            onClick={this.handleSaveRoom}
                            type="button"
                        >
                            {modalMode === "edit" ? "Cập nhật" : "Lưu"}
                        </button>

                        <button
                            className="cancel-room-btn"
                            onClick={this.closeModal}
                            type="button"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const {
            hotels,
            rooms,
            selectedHotel,
            searchRoom,
            currentPage,
            limit
        } = this.state;

        const filteredRooms =
            rooms.filter((item) => {
                const matchHotel =
                    selectedHotel
                        ? Number(item.hotel_id) === Number(selectedHotel)
                        : true;

                const matchRoom =
                    item.room_type
                        ?.toLowerCase()
                        .includes(searchRoom.toLowerCase());

                return matchHotel && matchRoom;
            });

        const indexOfLast = currentPage * limit;
        const indexOfFirst = indexOfLast - limit;

        const currentRooms =
            filteredRooms.slice(indexOfFirst, indexOfLast);

        const totalPages =
            Math.ceil(filteredRooms.length / limit);

        return (
            <div className="manage-room-page">
                <Header />

                <div className="manage-top">
                    <div className="manage-title">
                        <h1>Quản lý phòng</h1>
                    </div>

                    <div className="manage-actions">
                        <div className="filter-left">
                            <select
                                value={selectedHotel}
                                onChange={async (e) => {
                                    let hotelId = e.target.value;

                                    this.setState({
                                        selectedHotel: hotelId,
                                        currentPage: 1,
                                        form: {
                                            ...this.state.form,
                                            hotel_id: hotelId
                                        }
                                    });

                                    await this.getRoomsByHotel(hotelId);
                                }}
                            >
                                <option value="">Chọn khách sạn</option>

                                {hotels.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="Tìm loại phòng..."
                                value={searchRoom}
                                onChange={(e) =>
                                    this.setState({
                                        searchRoom: e.target.value,
                                        currentPage: 1
                                    })
                                }
                            />
                        </div>

                        <button
                            className="add-room-btn"
                            onClick={this.openAddModal}
                            type="button"
                        >
                            + Thêm phòng
                        </button>
                    </div>
                </div>

                <div className="manage-room-container">
                    <div className="room-table">
                        <div className="table-title">
                            {selectedHotel
                                ? 'Danh sách phòng'
                                : 'Chọn khách sạn để xem phòng'
                            }
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Ảnh</th>
                                    <th>Loại phòng</th>
                                    <th>Khách sạn</th>
                                    <th>Giá</th>
                                    <th>Thông tin</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentRooms.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            {item.roomImages?.[0]?.image_url
                                                ? (
                                                    <img
                                                        className="room-image"
                                                        src={item.roomImages[0].image_url}
                                                        alt="room"
                                                    />
                                                )
                                                : (
                                                    <div className="room-image-placeholder">
                                                        Không có hình ảnh
                                                    </div>
                                                )
                                            }
                                        </td>

                                        <td>
                                            <div className="room-info">
                                                <h4>{item.room_type}</h4>
                                                <p>
                                                    {item.size || "Không có thông tin kích thước"}
                                                </p>
                                            </div>
                                        </td>

                                        <td>{item.hotel?.name}</td>

                                        <td className="price">
                                            {Number(item.price).toLocaleString("vi-VN")}d
                                        </td>

                                        <td>
                                            <div className="room-meta">
                                                <span>{item.bed_info || "Không có thông tin giường"}</span>
                                                <span>Còn lại: {item.available_count || 0}</span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="action-group">
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => this.openEditModal(item)}
                                                    type="button"
                                                >
                                                    Sửa
                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() => this.handleDeleteRoom(item)}
                                                    type="button"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {currentRooms.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="empty-rooms">
                                            Không có phòng nào
                                        </td>
                                    </tr>
                                )}
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
                                    type="button"
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {this.renderRoomModal()}
            </div>
        );
    }
}

export default RoomManage;
