function openAddDepartmentModal() {
    showModal('department-modal');
    resetAddDepartmentForm();
    initAddDepartmentFormValidator({
        submitHandler: function () {
            let newDepartmentName = $("#department-name-input").val();
            let manager = $("#manager-input").val();
            insertNewDepartmentToServer(newDepartmentName, manager);
        }
    });
}

function resetAddDepartmentForm() {
    // set title for modal
    $("#department-modal-title").text("Add Department Modal");

    // hide created date field
    $("#created-date-field").addClass("d-none");
    $("#member-field").addClass("d-none");
    $("#creator-field").addClass("d-none");
    // show button add account
    $("#btn-add-account-into-department").removeClass("d-none");
    // reset input
    $("#department-name-input").val("");
    $("#manager-input").val("");

    // reset validator
    resetAddDepartmentValidator();

    initSelect2({
        name: 'validator-manager',
        placehoder: "Select manager..."
    })
    getManagersDepartmentFromServer(false);
}


function insertNewDepartmentToServer(departmentName, manager) {
    departmentAPI.insert({
        departmentName, manager,
        success: function () {
            hideModal('department-modal');
            showNotification("Create new Department", "Successfully! New Department created!");
            getDepartmentsDataForTable(); // reload table
        }
    });
}