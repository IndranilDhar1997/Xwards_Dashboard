import Config from '../../../config';

export default {
    SEARCHMEMBER: function (searchedData) {
        return Config[Config.env].RESTURL + '/team/users/' + searchedData; //Search Member
    },

    //Get roles for team management
    ROLE_DETAILS: function() {
        return Config[Config.env].RESTURL + '/team/roles/'; //GET Roles
    },

    //Add members to team
    ADD_TEAM_MEMBER: function() {
        return Config[Config.env].RESTURL + '/team/member/'; //ADD MEMBER
    },

    //Get team member list
    GET_TEAM_MEMBERS: function(brandId) {
        return Config[Config.env].RESTURL + '/team/brand/' + brandId; //GET TEAM MEMBERS
    },

    //Delete Team Member from selected brand
    DELETE_TEAM_MEMBER: function() {
        return Config[Config.env].RESTURL + '/team/member';
    },

    INVITE_MEMBER: function() {
        return Config[Config.env].RESTURL + '/team/invite-member';
    }
}