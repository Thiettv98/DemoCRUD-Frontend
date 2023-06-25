let deleteDepartmentId;
function openDeleteDepartmentModal(id, name) {
    deleteDepartmentId = id;
    showModal('delete-department-modal');
    $("#delete-department-name").text(name);
}

function deleteDepartmentFromServer() {
    departmentAPI.delete({
        departmentId: deleteDepartmentId,
        success: function () {
            hideModal('delete-department-modal');
            showNotification("Delete Department", "Successfully! Department deleted!");
            getDepartmentsDataForTable(); // reload table
        }
    });
}