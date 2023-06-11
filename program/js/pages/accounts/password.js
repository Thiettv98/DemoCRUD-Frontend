
function loadPasswordPage() {
    $("#content").load("../pages/accounts/password.html", function () {
        feather.replace();
        settingCommonForGroupPage();
    });
}