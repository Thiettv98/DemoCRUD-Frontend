
function loadAccountPage() {
    $("#content").load("../pages/accounts/accounts.html", function () {
        feather.replace();
        initSelect2({
            name: 'validator-role',
            placehoder: "Role"
        })
        initSelect2({
            name: 'validator-department',
            placehoder: "Department"
        })
        initSelect2({
            name: 'validator-status',
            placehoder: "Status"
        })
        settingCommonForGroupPage();
    });
}
