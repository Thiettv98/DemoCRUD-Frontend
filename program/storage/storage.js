let storage = {
    saveUserInfo: function (id, username, fullname) {
        localStorage.setItem(Constant.ID, id);
        localStorage.setItem(Constant.USERNAME, username);
        localStorage.setItem(Constant.FULLNAME, fullname);
    },
    removeUserInfo: function () {
        localStorage.removeItem(Constant.ID);
        localStorage.removeItem(Constant.USERNAME);
        localStorage.removeItem(Constant.FULLNAME);
    },
    getFullName: function () {
        return localStorage.getItem(Constant.FULLNAME);
    },
    isLogin: function () {
        return localStorage.getItem(Constant.ID) != null;
    }
}