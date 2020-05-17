import BrandService from "./brandService";

let user = null;

const UserProfileService = (function () {
    var setLoggedInUser = function(_user) {
        user = _user;
        user.token = user.UserLogin.auth_token;
        user.brands = user.UserOfUserBrand.map(userbrand => {
            let brand = {};
            brand.id = userbrand.brand_id;
            brand.name = userbrand.UserBrandOfBrand.name;
            brand.registered_name = userbrand.UserBrandOfBrand.registered_name;
            brand.logo_url = userbrand.UserBrandOfBrand.logo_url;
            brand.role = {};
            brand.role.id = userbrand.UserBrandOfRole.id;
            brand.role.display_name = userbrand.UserBrandOfRole.display_name;
            brand.role.name = userbrand.UserBrandOfRole.name;
            brand.role.description = userbrand.UserBrandOfRole.description;
            return brand;
        });
        delete user.UserLogin;
        delete user.UserOfUserBrand;
        localStorage.setItem('userId', user.id);
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user));
        BrandService.setBrandList(user.brands);
    };

    var getUserToken = function() {
        return user.UserLogin.auth_token;
    };

    var getUser = function() {
        if (user == null) {
            user = JSON.parse(localStorage.getItem('user'));
        }
        return user;
    };

    

    var logout = function() {
        localStorage.clear();
    };

    var getAvatarURL = function() {
        user = localStorage.getItem('user');
        var avatarUrl = user.avatar_url;
        return avatarUrl;
    };

    return {
        getUserToken: getUserToken, //Get User Auth Token
        getUser: getUser, //Get the user details
        setLoggedInUser: setLoggedInUser,
        logout: logout,
        getAvatarURL: getAvatarURL
    }
})();

export default UserProfileService;