import React, { Component } from 'react';
import './ModalEdit.scss'

class ModalEditHotel extends Component {

    constructor(props) {
        super(props);

        this.state = {

            id: '',

            name: '',

            city: '',

            address: '',

            rating: '',

            thumbnail: '',

            description: '',

            previewImg: '',

            hotelImages: []
        }
    }

    componentDidMount() {

        let hotel = this.props.currentHotel;

        if (hotel && hotel.id) {

            this.setState({

                id: hotel.id,

                name: hotel.name,

                city: hotel.city,

                address: hotel.address,

                rating: hotel.rating || '',

                thumbnail: hotel.thumbnail,

                description: hotel.description,

                previewImg: hotel.thumbnail,

                hotelImages:
                    hotel.hotelImages || []
            });
        }
    }
    componentDidUpdate(prevProps) {

        if (
            prevProps.currentHotel !==
            this.props.currentHotel
        ) {

            let hotel =
                this.props.currentHotel;

            if (hotel && hotel.id) {

                this.setState({

                    id: hotel.id,

                    name: hotel.name,

                    city: hotel.city,

                    address: hotel.address,

                    rating: hotel.rating || '',

                    thumbnail: hotel.thumbnail,

                    description: hotel.description,

                    previewImg: hotel.thumbnail,

                    hotelImages:
                        hotel.hotelImages || []
                });
            }
        }
    }
    handleChooseHotelImages = (event) => {

        let files = event.target.files;

        let arrImages = [];

        if (files && files.length > 0) {

            for (
                let i = 0;
                i < files.length;
                i++
            ) {

                arrImages.push({

                    file: files[i],

                    preview:
                        URL.createObjectURL(files[i])
                });
            }

            this.setState({

                hotelImages: [

                    ...this.state.hotelImages,

                    ...arrImages
                ]
            });
        }
    }

    handleOnChangeInput = (event, id) => {

        let copyState = { ...this.state };

        copyState[id] = event.target.value;

        this.setState({
            ...copyState
        });
    }

    handleChooseImage = async (event) => {

        let file = event.target.files[0];

        if (file) {

            let objectUrl = URL.createObjectURL(file);

            this.setState({
                previewImg: objectUrl,
                thumbnail: file
            });
        }
    }

    handleUpdateHotel = () => {

        let formData = new FormData();

        // ID

        formData.append(
            "id",
            this.state.id
        );

        // INFO

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

        // THUMBNAIL

        if (
            this.state.thumbnail &&
            typeof this.state.thumbnail !== "string"
        ) {

            formData.append(
                "thumbnail",
                this.state.thumbnail
            );
        }

        // HOTEL IMAGES

        if (
            this.state.hotelImages &&
            this.state.hotelImages.length > 0
        ) {

            this.state.hotelImages.forEach(item => {

                if (item.file) {

                    formData.append(
                        "hotelImages",
                        item.file
                    );
                }
            });
        }

        this.props.editHotel(formData);
    }

    render() {
        console.log("EDIT MODAL RENDER");

        let {
            closeModal
        } = this.props;


        return (

            <div className="hotel-edit-modal-overlay">

                <div className="hotel-edit-modal-container">
                    {/* HEADER */}

                    <div className="hotel-modal-header">

                        <h3>
                            Chỉnh sửa khách sạn
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
                                htmlFor="editHotelImage"
                                className="upload-image-btn"
                            >
                                <i className="fas fa-upload"></i>
                                Tải ảnh
                            </label>

                            <input
                                hidden
                                id="editHotelImage"
                                type="file"
                                onChange={(e) =>
                                    this.handleChooseImage(e)
                                }
                            />

                            {
                                this.state.previewImg &&
                                <div className="preview-image">

                                    <img
                                        src={this.state.previewImg}
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
                                htmlFor="editHotelImages"
                                className="upload-image-btn"
                            >
                                <i className="fas fa-images"></i>
                                Tải ảnh
                            </label>

                            <input
                                hidden
                                multiple
                                id="editHotelImages"
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
                                                    src={
                                                        item.preview
                                                            ? item.preview
                                                            : item.image_url
                                                    }
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
                                Description
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
                            className="btn-cancel-hotel"
                            onClick={closeModal}
                        >
                            Hủy
                        </button>

                        <button
                            className="btn-save-hotel"
                            onClick={() => this.handleUpdateHotel()}
                        >
                            Cập nhật
                        </button>

                    </div>

                </div>

            </div>
        )
    }
}

export default ModalEditHotel;
