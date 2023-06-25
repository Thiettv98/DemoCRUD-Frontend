function loadDepartmentPage() {
    $("#content").load("../pages/departments/departments.html", function () {
        feather.replace();
        settingCommonForDepartmentPage();
        refreshTable()
        getDepartmentsDataForTable();
    });
}

function settingCommonForDepartmentPage() {
    // common settings 
    $('[data-toggle="tooltip"]').tooltip();

    $('#min-date').datetimepicker({
        format: 'YYYY-MM-DD'
    });

    $('#max-date').datetimepicker({
        format: 'YYYY-MM-DD'
    });
}