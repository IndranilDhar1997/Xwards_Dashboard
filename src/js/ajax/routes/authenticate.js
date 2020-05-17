import Config from '../../../config';

export default {
    //LOGIN VERIFY
    LOGIN_VERIFY_URL: function (token) {
        return Config[Config.env].RESTURL + "/user/login/verify/" + encodeURIComponent(token); //Verify user login from URL params
    },
    
    LOGIN_VERIFY_LOCAL: function (userId, token) {
        return Config[Config.env].RESTURL + "/user/" + userId + "/verify/" + encodeURIComponent(token); //Verify user login from local storage
    },

    //LOGOUT
    LOGOUT: function () {
        return Config[Config.env].RESTURL + '/user/' + localStorage.getItem('userId') + '/logout'; //Logout URL
    }
}