import Config from '../../../config';

export default {
    ADD_CONTENTS: function() {
        return Config[Config.env].RESTURL + '/content/'; //Add Contents
    },
    GET_CONTENT: function(id) {
        return Config[Config.env].RESTURL + '/content/' + id; // Get Preview of Live Content
    },
    GET_CONTENTS: function () {
        return Config[Config.env].RESTURL + '/content/'; //GET Contents
    },
    GET_DRAFT_CONTENTS: function() {
        return Config[Config.env].RESTURL + '/content/draft/'; //GET Draft Contents
    },
    GET_INREVIEW_CONTENTS: function() {
        return Config[Config.env].RESTURL + '/content/in-review/'; //GET Draft Contents
    },
    DELETE_DRAFT_CONTENT: function(draftId) {
        return Config[Config.env].RESTURL + '/content/'+draftId+'/draft/'; //Delete Draft Contents
    },
    DELETE_INREVIEW_CONTENT: function(draftId) {
        return Config[Config.env].RESTURL + '/content/'+draftId+'/in-review/'; //Delete Draft Contents
    },
    SAVE_CONTENT_AS_DRAFT: function(contentId) {
        if (contentId) {
            return Config[Config.env].RESTURL + '/content/'+contentId+'/draft/'; // SAVE Content As Draft
        } else {
            return Config[Config.env].RESTURL + '/content/draft/'; // SAVE Content As Draft
        }
    },
    CHANGE_CONTENT_STATUS: function(id) {
        return Config[Config.env].RESTURL + '/content/'+id+'/status/'; // Change Status of Live Content
    },
    GET_DRAFT_BY_ID: function(draftId) {
        return Config[Config.env].RESTURL + '/content/draft/'+draftId; // GET Draft by ID
    },
    GET_INREVIEW_BY_ID: function(id) {
        return Config[Config.env].RESTURL + '/content/in-review/'+id; // GET Draft by ID
    },
    SAVE_FINAL_CONTENT: function(contentId) {
        return Config[Config.env].RESTURL + '/content/' + contentId; // SAVE Final Content
    }
}