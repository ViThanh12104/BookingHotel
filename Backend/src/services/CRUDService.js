import bcrypt from "bcryptjs"
import db from "../models/index";
import { where } from "sequelize";


const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await letHashUserPassword(data.password)
            await db.users.create({
                name: data.name,
                email: data.email,
                password: hashPasswordFromBcrypt,
                phone: data.phone,
                address: data.address,
                gender: data.gender == '1' ? true : false,
                role: data.role == '1' ? true : false,
            })

            resolve('ok create a new user succeed!')
        } catch (e) {
            reject(e)
        }
    })
    // console.log('data from service')
    // console.log(data)
    // console.log(hashPasswordFromBcrypt)
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

let getAllUser = () => {
    return new Promise(async (resolve, reject) =>{
        try {
            let users = db.users.findAll({
                raw : true,
            });
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}

let getUserInforbyId = (userid) =>{
    return new Promise(async(resolve, reject)=>{
        try {
            let user = await db.users.findOne({
                where: { id: userid},
                raw: true
            })

            if (user) {
                resolve(user)
            }
            else
            {
                resolve([])
            }
            
        } catch (error) {
            reject(error)
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.users.findOne({
                where: {id : data.id}
            })
            if (user) {
                user.name = data.name;
                user.email =  data.email;
                user.phone = data.phone;
                user.address = data.address;
                user.gender = data.gender;

                await user.save();

                let allusers = await db.users.findAll();
                resolve();
            }
            else{
                resolve();
            }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteUserbyId = (userid) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.users.findOne({
                where: {id: userid}
            })
            if(user){
                user.destroy();
            }
            resolve(); // return
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createNewUser: createNewUser,
    getAllUser : getAllUser,
    getUserInforbyId: getUserInforbyId,
    updateUserData: updateUserData,
    deleteUserbyId: deleteUserbyId
}