import Config from '../../../config';

export default {
    GETUSERDATA: function () {
        return Config[Config.env].RESTURL + '/user/' + localStorage.getItem('userId') + '/user'; //Get User Data
    },

    UPDATEUSERPROFILE: function () {
        return Config[Config.env].RESTURL + '/user/' + localStorage.getItem('userId') + '/profile'; //Update User Profile
    },

    UPDATEUSERIMAGE: function () { //TO DO REMOVE BASE64 AND ADD FORMDATA
        return Config[Config.env].RESTURL + '/user/' + localStorage.getItem('userId') + '/profile-pic'; //Update User Image
    },

    UPDATEUSEREMAIL: function () {
        return Config[Config.env].RESTURL + '/user/' + localStorage.getItem('userId') + '/email'; //Update User Email
    },

    UPDATEUSERPASSWORD: function () {
        return Config[Config.env].RESTURL + '/user/' + localStorage.getItem('userId') + '/password'; //Update User Password
    },
}