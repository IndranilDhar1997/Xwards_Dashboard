import Config from '../../../config';

export default {
    GET_CAMPAIGN_CATEGORY: function (brandId) {
        return Config[Config.env].RESTURL + '/brand/'+brandId+'/campaign/categories'; //GET Category and sub category while creating campagin
    },

    ADD_CAMPAIGN: function() {
        return Config[Config.env].RESTURL + '/campaign/'; //Add Campaign
    },
    
    GET_CAMPAIGN: function (brandId) {
        return Config[Config.env].RESTURL + "/brand/" + brandId + "/campaign/brand_id/" + brandId
    },

    UPDATE_CAMPAIGN_STATUS: function(brandId, campaignId) {
        return Config[Config.env].RESTURL + "/brand/" + brandId + "/campaign/" + campaignId + "/status";
    },

    //Creative Management routes
    Create_Collection: function(brandId) {
        return Config[Config.env].RESTURL + "/collection/brand/" + brandId; // Create Collection
    },

    Get_All_Collections: function(brandId) {
        return Config[Config.env].RESTURL + "/collection/brand/" + brandId; //Get All Colletions
    },

    Get_Collection_By_Id: function(brandId, collectionId) {
        return Config[Config.env].RESTURL + "/collection/brand/" + brandId + "/collection/" + collectionId // Get Collection By ID
    },

    Update_Collection: function(brandId, collectionId) {
        return Config[Config.env].RESTURL + "/collection/brand/" + brandId + "/collection/" + collectionId; // Update Collection
    },

    Delete_Collection: function(brandId, collectionId){
        return Config[Config.env].RESTURL+"/collection/brand/" + brandId + "/collection/" + collectionId // Delete  Collection
    },

    Create_Creative: function(brandId, collectionId) {
        return Config[Config.env].RESTURL + "/collection/brand/" + brandId + "/collection/" + collectionId; //Create Creatives
    },

    Get_All_Creatives: function(brandId, collectionId) {
        return Config[Config.env].RESTURL + "/collection/brand/"+brandId+"/collection/"+collectionId+"/creative"; //Get All Creatives
    },

    Get_Creative_By_Id: function(brandId, collectionId, creativeId) {
        return Config[Config.env].RESTURL + "/collection/brand/"+brandId+"/collection/"+collectionId+"/creative/"+creativeId //Get Creative By ID
    },

    Delete_Creative: function(brandId, collectionId, creativeId) {
        return Config[Config.env].RESTURL + "/collection/brand/"+brandId+"/collection/"+collectionId+"/creative/"+creativeId //Delete Creative By ID
    },

    Update_Creative: function(brandId, collectionId, creativeId) {
        return Config[Config.env].RESTURL + "/collection/brand/"+brandId+"/collection/"+collectionId+"/creative/"+creativeId //Update Creative By ID
    },

}