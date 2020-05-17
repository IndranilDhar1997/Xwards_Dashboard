import Config from '../../../config';

export default {
    XMUSIC_AUTH: function (token) { //GET
        return Config[Config.env].RESTURL + '/x-music'; //Get XPlay activation status
    },
    XMUSIC_REQUEST: function() { //POST
        return Config[Config.env].RESTURL + '/x-music/request'; //Post XPlay request form 
    },
    XMUSIC_UPLOAD_SONG: function() { //POST
        return Config[Config.env].RESTURL + '/x-music/music'; //Post XPlay upload song
    },

    XMUSIC_GET_MUSIC_COUNT: function() { //GET
        return Config[Config.env].RESTURL + '/x-music/count/music'; // Get all audios count
    },

    XMUSIC_GET_AUDIOS: function(type) { //GET
        let audioType = type || '';
        return Config[Config.env].RESTURL + '/x-music/music/'+audioType; // Get all audios
    },

    XMUSIC_DELETE_AUDIO: function(musicId) {
        return Config[Config.env].RESTURL + '/x-music/music/'+musicId; // DELETE AUDIO
    },

    XMUSIC_GET_AUDIO_BY_ID: function(musicId) {
        return Config[Config.env].RESTURL + '/x-music/music/'+musicId; // GET AUDIO By Id
    },

    XMUSIC_UPDATE_AUDIO: function(musicId) {
        return Config[Config.env].RESTURL + '/x-music/music/'+musicId; // Update AUDIO
    }
}