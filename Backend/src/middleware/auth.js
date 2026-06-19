import { verifyTokenString } from "../utils/jwt";

let verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            errCode: 401,
            errMessage: "Unauthorized: missing token"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyTokenString(token);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).json({
            errCode: 401,
            errMessage: "Unauthorized: invalid or expired token"
        });
    }
};

let requireAdmin = (req, res, next) => {
    const role = (req.user?.role || "").toLowerCase();

    if (role !== "admin") {
        return res.status(403).json({
            errCode: 403,
            errMessage: "Forbidden: admin access required"
        });
    }

    next();
};

export { verifyToken, requireAdmin };
