let baseUrl = 'http://localhost:3000/api/v1';
let loginUrl = `${baseUrl}/accounts`;

let authAPI = {
    login: function ({ username, password, success }) {
        $.ajax({
            url: `${loginUrl}?username=${username}&password=${password}`,
            type: 'GET',
            contentType: "application/json",
            dataType: 'json',
            success: function (data) {
                success(data);
            },
            error(jqXHR, textStatus, errorThrown) {
                // error
                showNotification("Login", "Fail! There is a error!", false);
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }
}