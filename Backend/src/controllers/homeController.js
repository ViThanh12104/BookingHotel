import db from "../models/index";
import CRUDService from "../services/CRUDService";


let getHomePage = async (req, res) => {
    try {
        let data = await db.users.findAll();
        return res.render("homePage.ejs", {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
    }
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body)
    console.log(message);
    return res.send('post crud from sever');
}

let displayCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render('displaycrud.ejs', {
        dataTable: data
    })
}

let getEditCRUD = async (req, res) => {
    let userid = req.query.id;
    if (userid) {
        let userData = await CRUDService.getUserInforbyId(userid);
        //check userData not found

        return res.render('editcrud.ejs', {
            user: userData
        });

    }
    else {
        return res.send("User not found!!");
    }

}

let putCRUD = async (req, res) => {
    let data = req.body;
    await CRUDService.updateUserData(data);
    let allusers = await CRUDService.getAllUser();;

    return res.render('displaycrud.ejs', {
        dataTable: allusers
    })
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUserbyId(id);
        return res.send('delete user succeed')
    } else {
        return res.send('delete user fail!!')
    }

}

export default {
    getHomePage,
        getCRUD,
        postCRUD,
        displayCRUD,
        getEditCRUD,
        putCRUD,
        deleteCRUD
}