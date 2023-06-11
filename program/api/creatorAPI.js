let creatorsBaseUrl = `${baseUrl}/creators`;

let creatorAPI = {
    getAll: function ({ success }) {
        $.ajax({
            url: creatorsBaseUrl,
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