import axios from "../axios"

const handleLogin = (email, password) => {
    return axios.post('api/login', { email, password }
    );
}

const getAllUsers = (id) => {
    return axios.get(`/api/get-all-users?id=${id}`)
}

const createNewUserFromService = (data) => {
    return axios.post('/api/create-new-user', data)
}

const deleteUserService = (id) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: id
        }
    })
}

const editUserService = (data) => {
    return axios.put('/api/edit-user', data)
}

const handleRegister = (data) => {
    return axios.post('/api/register', data);
}

export default {
    handleLogin,
    getAllUsers,
    createNewUserFromService,
    deleteUserService,
    editUserService,
    handleRegister
}