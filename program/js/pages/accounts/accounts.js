
function loadAccountPage() {
    $("#content").load("../pages/accounts/accounts.html", function () {
        feather.replace();
        settingCommonForGroupPage();
    });
}