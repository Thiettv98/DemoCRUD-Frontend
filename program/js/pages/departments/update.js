let updateDepartmentId;
let oldDepartmentName;

function openUpdateDepartmentModal(id) {
    updateDepartmentId = id;
    showModal('department-modal');
    resetUpdateDepartmentForm();
    initUpdateDepartmentFormValidator({
        submitHandler: function () {
            let departmentName = $("#department-name-input").val();
            let manager = $("#manager-input").val();
            let member = $("#member-input").val();
            let creator = $("#creator-input").val();
            let createdDate = $("#created-date-input").val();
            updateNewDepartmentInfoToServer(departmentName, manager, member, creator, createdDate);
        }
    });
}

function resetUpdateDepartmentForm() {
    // set title for modal
    $("#department-modal-title").text("Update Department Modal");

    // show created date field
    $("#created-date-field").removeClass("d-none");
    $("#creator-field").removeClass("d-none");
    $("#member-field").removeClass("d-none");
    
    // hide button add account
    $("#btn-add-account-into-department").addClass("d-none");

    // reset input value
    $("#department-name-input").val("");
    $("#member-input").val("");
    $("#creator-input").val("");
    // reset validaion
    resetUpdateDepartmentValidator();

    initSelect2({
        name: 'validation-manager',
        placeholder: "Select manager..."
    });

    getManagersDepartmentFromServer(true);
    getCreatorsDepartmentFromServer(true);
}

function getDetailDepartmentFromServer() {
    departmentAPI.getDetail({
        departmentId: updateDepartmentId,
        success: function (data) {
            fillDetailDepartmentToUpdateDepartmentModal(data);
        }
    });
}

function fillDetailDepartmentToUpdateDepartmentModal(department) {
    oldDepartmentName = department.name;

    $("#department-name-input").val(department.name);
    $("#member-input").val(department.member);
    $("#manager-input").val(department.manager).change();
    $("#creator-input").val(department.creator);
    $("#created-date-input").val(department.createdDate);
}

function updateNewDepartmentInfoToServer(departmentName, manager, member, creator, createdDate) {
    departmentAPI.update({
        departmentId: updateDepartmentId,
        departmentName, manager, member, creator, createdDate,
        success: function () {
            hideModal('department-modal');
            showNotification("Update Department", "Successfully! Department updated!");
            getDepartmentsDataForTable(); // reload table
        }
    });
}