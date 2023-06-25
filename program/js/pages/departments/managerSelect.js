function getManagersDepartmentFromServer(isUpdateModal) {
    managerAPI.getAll({
        success: function (data) {
            // success
            fillManagersToSelectDepartmentOfAddDepartmentModal(data, isUpdateModal);
        },
    });
}

function fillManagersToSelectDepartmentOfAddDepartmentModal(managers, isUpdateModal) {
    let rows = "<option value=''>Select manager...</option>";

    for (const manager of managers) {
        let row = `<option value="${manager}">${manager}</option>`;
        rows += row;
    }
    $('#manager-input').empty();
    $('#manager-input').append(rows);
    if (isUpdateModal) getDetailDepartmentFromServer();
}