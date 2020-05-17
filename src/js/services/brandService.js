let brandList = null;
let selectedBrand = null;

const BrandService = (function () {

    var addBrandToList = function(brand) {
        delete brand.role.created_at;
        delete brand.role.updated_at;
        delete brand.role.deleted_at;
        brandList.push(brand);
        localStorage.setItem('userBrandList', JSON.stringify(brandList));
    }

    var setBrandList = function (brands) {
        brandList = brands;
        localStorage.setItem('userBrandList', JSON.stringify(brands));
    };

    var getBrandList = function () {
        if (brandList == null) { //Load from local storage
            brandList = JSON.parse(localStorage.getItem('userBrandList'));
        }
        return brandList;
    };

    var setSelectedBrand = function (brandId) {
        selectedBrand = brandList.find(function (element) {
            return parseInt(element.id) === parseInt(brandId);
        });
        localStorage.setItem('selectedbrand', JSON.stringify(selectedBrand));
    };

    var getSelectedBrand = function () {
        if (selectedBrand === null && localStorage.getItem('selectedbrand') !== 'undefined') { //Load from local storage
            selectedBrand = JSON.parse(localStorage.getItem('selectedbrand'));
        }
        return selectedBrand;
    };

    return {
        addBrandToList: addBrandToList,
        setBrandList: setBrandList,
        getBrandList: getBrandList,
        setSelectedBrand: setSelectedBrand,
        getSelectedBrand: getSelectedBrand
    }

})();

export default BrandService;