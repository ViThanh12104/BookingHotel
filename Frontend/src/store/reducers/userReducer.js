import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoggedIn: false,
    userInfor: null,
    token: null
}

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                userInfor: action.userInfor,
                token: action.token || null
            }
        case actionTypes.USER_LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                userInfor: null,
                token: null
            }
        case actionTypes.PROCESS_LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                userInfor: null,
                token: null
            }
        default:
            return state;
    }
}

export default appReducer;