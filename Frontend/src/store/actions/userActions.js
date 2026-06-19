import actionTypes from './actionTypes';

export const addUserSuccess = () => ({
    type: actionTypes.ADD_USER_SUCCESS
})

export const userLoginSuccess = (userInfor, token) => ({
    type: actionTypes.USER_LOGIN_SUCCESS,
    userInfor: userInfor,
    token: token
})

export const userLoginFail = () => ({
    type: actionTypes.USER_LOGIN_FAIL
})

export const processLogout = () => (dispatch) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    dispatch({ type: actionTypes.PROCESS_LOGOUT });
}