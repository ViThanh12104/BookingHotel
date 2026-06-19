import Joi from "joi";

const validationSchemas = {
    // User validation schemas
    login: Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Email must be valid",
            "any.required": "Email is required"
        }),
        password: Joi.string().min(6).required().messages({
            "string.min": "Password must be at least 6 characters",
            "any.required": "Password is required"
        })
    }),

    register: Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Email must be valid",
            "any.required": "Email is required"
        }),
        password: Joi.string().min(6).required().messages({
            "string.min": "Password must be at least 6 characters",
            "any.required": "Password is required"
        }),
        name: Joi.string().min(2).max(100).required().messages({
            "string.min": "Name must be at least 2 characters",
            "string.max": "Name must not exceed 100 characters",
            "any.required": "Name is required"
        })
    }),

    createUser: Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().min(2).max(100).required(),
        phone: Joi.string().optional(),
        address: Joi.string().optional(),
        gender: Joi.string().optional(),
        password: Joi.string().min(6).required(),
        role: Joi.string().optional()
    }),

    editUser: Joi.object({
        id: Joi.number().required().messages({
            "any.required": "User ID is required"
        }),
        email: Joi.string().email().optional(),
        name: Joi.string().min(2).max(100).optional(),
        phone: Joi.string().optional(),
        address: Joi.string().optional(),
        gender: Joi.string().optional(),
        role: Joi.string().optional()
    }),

    deleteUser: Joi.object({
        id: Joi.number().required().messages({
            "any.required": "User ID is required"
        })
    }),

    // Hotel validation schemas
    createHotel: Joi.object({
        name: Joi.string().min(3).max(255).required().messages({
            "any.required": "Hotel name is required"
        }),
        city: Joi.string().required().messages({
            "any.required": "City is required"
        }),
        address: Joi.string().required().messages({
            "any.required": "Address is required"
        }),
        description: Joi.string().optional(),
        rating: Joi.number().min(0).max(5).optional(),
        price_from: Joi.number().min(0).optional()
    }),

    editHotel: Joi.object({
        id: Joi.number().required().messages({
            "any.required": "Hotel ID is required"
        }),
        name: Joi.string().min(3).max(255).optional(),
        city: Joi.string().optional(),
        address: Joi.string().optional(),
        description: Joi.string().optional(),
        rating: Joi.number().min(0).max(5).optional(),
        price_from: Joi.number().min(0).optional()
    }),

    deleteHotel: Joi.object({
        id: Joi.number().required().messages({
            "any.required": "Hotel ID is required"
        })
    }),

    getHotelDetail: Joi.object({
        id: Joi.number().required().messages({
            "any.required": "Hotel ID is required"
        })
    }),

    getHotelsByCity: Joi.object({
        city: Joi.string().required().messages({
            "any.required": "City is required"
        })
    }),

    // Room validation schemas
    createRoom: Joi.object({
        hotel_id: Joi.number().required().messages({
            "any.required": "Hotel ID is required"
        }),
        name: Joi.string().min(3).max(100).required(),
        type: Joi.string().required(),
        price: Joi.number().min(0).required(),
        quantity: Joi.number().min(1).integer().required(),
        description: Joi.string().optional(),
        amenities: Joi.string().optional()
    }),

    editRoom: Joi.object({
        id: Joi.number().required().messages({
            "any.required": "Room ID is required"
        }),
        name: Joi.string().min(3).max(100).optional(),
        type: Joi.string().optional(),
        price: Joi.number().min(0).optional(),
        quantity: Joi.number().min(1).integer().optional(),
        description: Joi.string().optional(),
        amenities: Joi.string().optional()
    }),

    deleteRoom: Joi.object({
        id: Joi.number().required().messages({
            "any.required": "Room ID is required"
        })
    }),

    getRoomsByHotel: Joi.object({
        hotelId: Joi.number().required().messages({
            "any.required": "Hotel ID is required"
        })
    }),

    // Booking validation schemas
    createBooking: Joi.object({
        room_id: Joi.number().required().messages({
            "any.required": "Room ID is required"
        }),
        check_in: Joi.date().iso().required().messages({
            "any.required": "Check-in date is required"
        }),
        check_out: Joi.date().iso().required().messages({
            "any.required": "Check-out date is required"
        }),
        hotel_id: Joi.number().optional(),
        number_of_guests: Joi.number().min(1).integer().optional(),
        total_price: Joi.number().min(0).optional()
    }),

    cancelBooking: Joi.object({
        id: Joi.number().required().messages({
            "any.required": "Booking ID is required"
        }),
        userId: Joi.number().required().messages({
            "any.required": "User ID is required"
        })
    }),

    adminCancelBooking: Joi.object({
        id: Joi.number().required().messages({
            "any.required": "Booking ID is required"
        })
    }),

    getBookingByUser: Joi.object({
        userId: Joi.number().required().messages({
            "any.required": "User ID is required"
        })
    }),

    confirmBooking: Joi.object({
        id: Joi.number().required()
    }),

    checkinBooking: Joi.object({
        id: Joi.number().required()
    }),

    checkoutBooking: Joi.object({
        id: Joi.number().required()
    }),

    // Review validation schemas
    createReview: Joi.object({
        hotel_id: Joi.number().required(),
        rating: Joi.number().min(1).max(5).required().messages({
            "any.required": "Rating is required",
            "number.min": "Rating must be between 1 and 5",
            "number.max": "Rating must be between 1 and 5"
        }),
        comment: Joi.string().min(3).max(1000).optional()
    }),

    getReviewByHotel: Joi.object({
        hotelId: Joi.number().required()
    })
};

// Validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        // Determine which part of request to validate
        let dataToValidate = req.body;
        
        // For GET requests, validate query parameters
        if (req.method === "GET") {
            dataToValidate = req.query;
        }

        const { error, value } = schema.validate(dataToValidate, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const details = error.details.map(detail => ({
                field: detail.path.join("."),
                message: detail.message
            }));

            return res.status(400).json({
                errCode: 400,
                errMessage: "Validation error",
                errors: details
            });
        }

        // Replace request data with validated data
        if (req.method === "GET") {
            Object.assign(req.query || {}, value);
        } else {
            req.body = value;
        }

        next();
    };
};

export { validationSchemas, validate };
