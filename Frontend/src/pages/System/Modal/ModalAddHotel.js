import React, { Component } from 'react';
import './ModalAdd.scss'


class ModalAddHotel extends Component {

    constructor(props) {
        super(props);

        this.state = {

            name: '',
            city: '',
            address: '',
            rating: '',
            description: '',

            thumbnail: '',
            previewThumbnail: '',

            hotelImages: []
        }
    }

    handleOnChangeInput = (event, id) => {

        let copyState = { ...this.state };

        copyState[id] = event.target.value;

        this.setState({
            ...copyState
        });
    }
    handleChooseThumbnail = (event) => {

        const file = event.target.files[0];

        if (!file) return;

        const preview =
            URL.createObjectURL(file);

        this.setState({

            thumbnail: file,

            previewThumbnail: preview
        });

        console.log(preview);
    }
    handleChooseHotelImages = (event) => {

        const files = Array.from(
            event.target.files
        );

        if (!files.length) return;

        const previewImages =
            files.map(file => {

                return {

                    file: file,

                    preview:
                        URL.createObjectURL(file)
                }
            });

        this.setState({

            hotelImages: previewImages
        });

        console.log(previewImages);
    }

    handleSave = () => {

        let formData = new FormData();

        formData.append(
            "name",
            this.state.name
        );

        formData.append(
            "city",
            this.state.city
        );

        formData.append(
            "address",
            this.state.address
        );

        formData.append(
            "rating",
            this.state.rating || 0
        );

        formData.append(
            "description",
            this.state.description
        );

        // thumbnail

        formData.append(
            "thumbnail",
            this.state.thumbnail
        );

        // multiple hotel images

        this.state.hotelImages.forEach(item => {

            formData.append(
                "hotelImages",
                item.file
            );
        });

        this.props.createHotel(formData);
    }

    render() {

        let {
            closeModal
        } = this.props;


        return (

            <div className="hotel-modal-overlay">

                <div className="hotel-modal-container">

                    {/* HEADER */}

                    <div className="hotel-modal-header">

                        <h3>
                            Thêm khách sạn mới
                        </h3>

                        <span onClick={closeModal}>
                            ×
                        </span>

                    </div>

                    {/* BODY */}

                    <div className="hotel-modal-body">

                        <div className="hotel-form-grid">

                            <div className="form-group">

                                <label>
                                    Tên khách sạn
                                </label>

                                <input
                                    type="text"
                                    value={this.state.name}
                                    onChange={(e) =>
                                        this.handleOnChangeInput(e, 'name')
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Thành phố
                                </label>

                                <input
                                    type="text"
                                    value={this.state.city}
                                    onChange={(e) =>
                                        this.handleOnChangeInput(e, 'city')
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Địa chỉ
                                </label>

                                <input
                                    type="text"
                                    value={this.state.address}
                                    onChange={(e) =>
                                        this.handleOnChangeInput(e, 'address')
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Đánh giá
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={this.state.rating}
                                    onChange={(e) =>
                                        this.handleOnChangeInput(e, 'rating')
                                    }
                                />

                            </div>

                        </div>

                        {/* IMAGE */}

                        <div className="form-group">

                            <label>
                                    Ảnh đại diện
                            </label>
                            <label
                                htmlFor="thumbnail"
                                className="upload-image-btn"
                            >
                                <i className="fas fa-upload"></i>
                                Tải ảnh đại diện
                            </label>

                            <input
                                hidden
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    this.handleChooseThumbnail(e)
                                }
                            />

                            {
                                this.state.previewThumbnail &&
                                <div className="preview-thumbnail">

                                    <img
                                        src={
                                            this.state.previewThumbnail
                                        }
                                        alt=""
                                    />

                                </div>
                            }

                        </div>

                        <div className="form-group">

                            <label>
                                Ảnh khách sạn
                            </label>

                            <label
                                htmlFor="hotelImages"
                                className="upload-image-btn"
                            >
                                <i className="fas fa-images"></i>
                                Tải ảnh
                            </label>

                            <input
                                hidden
                                multiple
                                id="hotelImages"
                                type="file"
                                onChange={(e) =>
                                    this.handleChooseHotelImages(e)
                                }
                            />

                            <div className="preview-hotel-images">

                                {
                                    this.state.hotelImages &&
                                    this.state.hotelImages.map(
                                        (item, index) => {

                                            return (

                                                <img
                                                    key={index}
                                                    src={item.preview}
                                                    alt=""
                                                />
                                            )
                                        }
                                    )
                                }

                            </div>

                        </div>

                        {/* DESCRIPTION */}

                        <div className="form-group">

                            <label>
                                Mô tả
                            </label>

                            <textarea
                                value={this.state.description}
                                onChange={(e) =>
                                    this.handleOnChangeInput(e, 'description')
                                }
                            />

                        </div>

                    </div>

                    {/* FOOTER */}

                    <div className="hotel-modal-footer">

                        <button
                            className="btn-save-hotel"
                            onClick={() => this.handleSave()}
                        >
                            Lưu
                        </button>

                        <button
                            className="btn-cancel-hotel"
                            onClick={closeModal}
                        >
                            Hủy
                        </button>

                    </div>

                </div>

            </div>
        )
    }
}

export default ModalAddHotel;
