import userService from "../services/userService"
import { signToken } from "../utils/jwt";
import { asyncHandler } from "../middleware/errorHandler";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/errors";

let handleLogin = asyncHandler(async (req, res) => {
    let { email, password } = req.body;

    let userData = await userService.handleUserLogin(email, password);

    if (userData.errCode !== 0 || !userData.user) {
        throw new BadRequestError(userData.errMessage);
    }

    const token = signToken({
        id: userData.user.id,
        email: userData.user.email,
        role: (userData.user.role || "customer").toLowerCase()
    });

    return res.status(200).json({
        errCode: 0,
        errMessage: userData.errMessage,
        userData: userData.user,
        token
    })
});

let handleRegister = asyncHandler(async (req, res) => {
    let message = await userService.handleRegister(req.body);

    if (message.errCode !== 0) {
        throw new ConflictError(message.message);
    }

    return res.status(201).json({
        errCode: 0,
        errMessage: message.message
    })
});

let handleGetAllUsers = asyncHandler(async (req, res) => {
    let id = req.query.id || "All";

    let users = await userService.getAllUser(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        users: users
    });
});

let handleCreateNewUser = asyncHandler(async (req, res) => {
    let message = await userService.createNewUser(req.body)

    if (message.errCode !== 0) {
        throw new ConflictError(message.errMessage);
    }

    return res.status(201).json({
        errCode: 0,
        errMessage: message.errMessage,
        user: message.user
    });
});

let handleDeleteUser = asyncHandler(async (req, res) => {
    let message = await userService.deleteUser(req.body.id);

    if (message.errCode !== 0) {
        throw new NotFoundError("User");
    }

    return res.status(200).json({
        errCode: 0,
        errMessage: message.errMessage
    });
});

let handleEditUser = asyncHandler(async (req, res) => {
    let data = req.body;
    let message = await userService.updateUser(data);

    if (message.errCode !== 0) {
        throw new NotFoundError("User");
    }

    return res.status(200).json({
        errCode: 0,
        errMessage: message.errMessage,
        user: message.user
    });
});

export default {
    handleLogin,
    handleRegister,
        handleGetAllUsers,
        handleCreateNewUser,
        handleDeleteUser,
        handleEditUser
}