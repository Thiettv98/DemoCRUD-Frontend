$(function () {
    initLoginFormValidator({
        submitHandler: function () {
            let username = $("#username-input").val();
            let password = $("#password-input").val();
            login(username, password);
        }
    });
});

function login(username, password, success) {
    authAPI.login({
        username, password,
        success: function (data) {
            // fail
            if (data.length == 0) {
                showNotification("Login", "Fail! Please login again!", false);
                $("#password-input").val("");
            } else {
                // success
                let userInfo = data[0];
                storage.saveUserInfo(userInfo.id, userInfo.username, userInfo.fullname);
                location.href = '../../common/index.html';
            }
        }
    })
}

