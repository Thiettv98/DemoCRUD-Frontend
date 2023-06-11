function loadGroupPage() {
    $("#content").load("../pages/groups/groups.html", function () {
        feather.replace();
        settingCommonForGroupPage();
        getGroupsDataForTable();
    });
}

function settingCommonForGroupPage() {
    // common settings 
    $('[data-toggle="tooltip"]').tooltip();

    $('#min-date').datetimepicker({
        format: 'YYYY-MM-DD'
    });

    $('#max-date').datetimepicker({
        format: 'YYYY-MM-DD'
    });
}