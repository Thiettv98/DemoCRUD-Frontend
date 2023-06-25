let managersBaseUrl = `${baseUrl}/managers`;

let managerAPI = {
    getAll: function ({ success }) {
        $.ajax({
            url: managersBaseUrl,
            type: 'GET',
            contentType: "application/json",
            dataType: 'json',
            success: success,
            error(jqXHR, textStatus, errorThrown) {
                // error
                showNotification("Get Creator", "Fail! There is a error!", false);
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }
}