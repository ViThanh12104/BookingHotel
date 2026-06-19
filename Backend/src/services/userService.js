import bcrypt from "bcryptjs"
import e from "express";
const db = require("../models/index");

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            // chỉ query 1 lần
            let user = await db.users.findOne({
                where: { email: email },
                attributes: ['id', 'name', 'email', 'role', 'password'],
                raw: true
            });

            // không tìm thấy user
            if (!user) {
                userData.errCode = 1;
                userData.errMessage = "Email does not exist";
                return resolve(userData);
            }

            // password null hoặc rỗng
            if (!user.password) {
                userData.errCode = 2;
                userData.errMessage = "Password data is invalid";
                return resolve(userData);
            }

            // so sánh password
            let check = await bcrypt.compare(password, user.password);

            if (check) {
                delete user.password;

                userData.errCode = 0;
                userData.errMessage = "OK";
                userData.user = user;
            } else {
                userData.errCode = 3;
                userData.errMessage = "Wrong password";
            }

            resolve(userData);

        } catch (error) {
            reject(error);
        }
    });
};

let handleRegister = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let check = await checkEmail(data.email);

            if (check === true) {
                resolve({
                    errCode: 1,
                    message: "Email already exists"
                })
            } else {

                let hashPasswordFromBcrypt = await letHashUserPassword(data.password);

                await db.users.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    name: data.name,
                    role: 'Customer'
                });

                resolve({
                    errCode: 0,
                    message: "Register success"
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}



let getAllUser = (userid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = null;

            if (!userid) {
                return resolve([]);
            }

            if (userid === 'All') {
                user = await db.users.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                });
            } else {
                user = await db.users.findOne({
                    where: { id: userid },
                    attributes: {
                        exclude: ['password']
                    }
                });
            }

            resolve(user);

        } catch (error) {
            reject(error);
        }
    });
}

let checkEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.users.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email is exist??
            let check = await checkEmail(data.email)
            if (check) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in used. Pls try another email'
                })

            } else {
                let hashPasswordFromBcrypt = await letHashUserPassword(data.password);

                let newUser = await db.users.create({
                    name: data.name,
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    phone: data.phone,
                    address: data.address,
                    gender: data.gender == '1' ? true : false,
                    role: data.role,
                })

                resolve({
                    errCode: 0,
                    errMessage: "User created successfully",
                    user: newUser
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}



let letHashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        }
        catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.users.findOne({
                where: { id: userId }
            })
            if (!user) {
                return resolve({
                    errCode: 2,
                    errMessage: "The user isn't esixt"
                })
            }
            await db.users.destroy({
                where: { id: userId }
            })
            resolve({
                errCode: 0,
                errMessage: "The user is deleted!"
            })
        }
        catch (e) {
            reject(e);
        }
    })
}

let updateUser = async (data) => {
    try {
        if (!data.id) {
            return {
                errCode: 2,
                errMessage: "Missing user id"
            }
        }

        let user = await db.users.findOne({
            where: { id: data.id },
            raw: true
        })

        if (!user) {
            return {
                errCode: 1,
                errMessage: "User not found"
            }
        }

        await db.users.update(
            {
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                gender: data.gender == '1' ? true : false,
                role: data.role
            },
            {
                where: { id: data.id }
            }
        )

        let updatedUser = await db.users.findOne({
            where: { id: data.id },
            raw: true
        })

        return {
            errCode: 0,
            errMessage: "Update user succeeds",
            user: updatedUser
        }

    } catch (e) {
        console.log('ERROR UPDATE USER:', e);
        throw e
    }
}

module.exports = {
    handleUserLogin,
    handleRegister,
    checkEmail,
    getAllUser,
    createNewUser,
    letHashUserPassword,
    deleteUser,
    updateUser
}