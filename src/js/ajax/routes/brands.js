import Config from '../../../config';

export default {
    ADDBRAND: function () {
        return Config[Config.env].RESTURL + '/brand/'; //Add Brand
    },

    GETBRAND: function () {
        return Config[Config.env].RESTURL + '/brand/'; //GET Brand
    },

    GET_BRAND_BY_ID: function(brandId) {
        return Config[Config.env].RESTURL + '/brand/'+ brandId; //GET Brand By Id
    },

    DELETE_BRAND: function(brandId) {
        return Config[Config.env].RESTURL + '/brand/'+ brandId; //DELETE Brand
    }
}