let brandList = null;
let selectedBrand = null;
const BrandService = {
    setBrandList: (brands) => {
        brandList = brands;
    },
    getBrandList: () => {
        return brandList;
    },
    setBrand: (brandId) => {
        selectedBrand = brandList.find(function(element) {
            return element.id === brandId;
        });
    },
    getBrand: () => {
        return selectedBrand;
    }
}

export default BrandService;