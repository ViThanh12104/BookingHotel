import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "booking-hotel-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

let signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

let verifyTokenString = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

export { signToken, verifyTokenString };
