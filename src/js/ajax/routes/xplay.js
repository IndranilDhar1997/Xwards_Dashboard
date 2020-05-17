import Config from '../../../config';

export default {
    XPLAY_AUTH: function (token) { //GET
        return Config[Config.env].RESTURL + '/x-play'; //Get XPlay activation status
    },
    XPLAY_REQUEST: function() { //POST
        return Config[Config.env].RESTURL + '/x-play/request'; //Post XPlay request form 
    },
    XPLAY_CREATE_CHANNEL: function() { //POST
        return Config[Config.env].RESTURL + '/x-play/channel'; //Post XPlay new Channel details
    },
    XPLAY_UPDATE_CHANNEL: function(channelId) { //PUT
        return Config[Config.env].RESTURL + '/x-play/channel/'+channelId; //Update XPlay Channel details
    },
    XPLAY_GET_CHANNEL_LIST: function() { //GET
        return Config[Config.env].RESTURL + '/x-play/channel'; //Get XPlay channel list
    },
    XPLAY_GET_CHANNEL_DETAILS: function(channelId) { //GET
        return Config[Config.env].RESTURL + '/x-play/channel/' + channelId; //Get XPlay channel details and listed videos
    },
    XPLAY_UPDATE_CHANNEL_COVER_PHOTO: function(channelId) { //PUT
        return Config[Config.env].RESTURL + '/x-play/channel/'+ channelId+'/cover-photo'; //Update Xplay channel cover photo
    },
    XPLAY_DELETE_CHANNEL: function(channelId) { //DELETE
        return Config[Config.env].RESTURL + '/x-play/channel/' + channelId; //Delete XPlay channel
    },
    XPLAY_UPLOAD_VIDEO: function (channelId) { //POST
        return Config[Config.env].RESTURL + '/x-play/channel/' + channelId + '/video'; //Upload and Save XPlay Video on a channel
    },
    XPLAY_VIDEO_DETAIL: function (channelId, videoId) { //GET
        return Config[Config.env].RESTURL + '/x-play/channel/' + channelId + '/video/'+videoId; //Upload and Save XPlay Video on a channel
    },
    XPLAY_GET_CHANNEL_VIDEOS: function(channelId, type) { //GET
        let videoType = type || '';
        return Config[Config.env].RESTURL + '/x-play/channel/' + channelId + '/video/'+videoType; // Get Channel all videos
    },
    XPLAY_DELETE_VIDEO: function(videoId, channelId) { //DELETE
        return Config[Config.env].RESTURL + '/x-play/channel/' + channelId + '/video/' + videoId; // Delete Video of seleted channel
    },
    XPLAY_UPDATE_VIDEO_DETAILS: function(channelId, videoId) { //PUT
        return Config[Config.env].RESTURL + '/x-play/channel/' + channelId + '/video/' + videoId; // Delete Video of seleted channel
    },
    
    XPLAY_GET_LIVE_VIDEO_BY_ID: function(videoId) {
        return Config[Config.env].RESTURL + '/x-play/video-neo/' + videoId; //Get Live Video By Id
    },

    XPLAY_GET_CHANNEL_PLAYLISTS: function(channelId) {
        return Config[Config.env].RESTURL + '/x-play/playlist/' + channelId // Get Playlists
    },

    SEARCHPLAYLIST: function (channelId, searchedData) {
        return Config[Config.env].RESTURL + '/x-play/playlist/' + channelId + '/search/' + searchedData; //Search Member
    },

    XPLAY_UPLOAD_PLAYLISTS: function(channelId) {
        return Config[Config.env].RESTURL+ '/x-play/playlist/' + channelId // Upload Playlist
    },

    XPLAY_DELETE_PLAYLIST: function(channelId, playlistId) {
        return Config[Config.env].RESTURL+ '/x-play/playlist/' + channelId + "/" + playlistId // Delete Playlist
    },
    XPLAY_PUBLISH_PLAYLIST: function() {
        return Config[Config.env].RESTURL + '/x-play/playlist/publish' // Publish Playlist
    },
    XPLAY_GET_PLAYLIST_BY_ID: function(channelId, playlistId) {
        return Config[Config.env].RESTURL + '/x-play/playlist/' + channelId + "/" + playlistId // Get Playlist by Id
    },
    XPLAY_UPDATE_PLAYLIST: function(channelId, playlistId) {
        return Config[Config.env].RESTURL + '/x-play/playlist/' + channelId + "/" + playlistId
    }

}