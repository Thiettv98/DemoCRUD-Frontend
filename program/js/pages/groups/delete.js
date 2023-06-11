let deleteGroupId;
function openDeleteGroupModal(id, name) {
    deleteGroupId = id;
    showModal('delete-group-modal');
    $("#delete-group-name").text(name);
}

function deleteGroupFromServer() {
    groupAPI.delete({
        groupId: deleteGroupId,
        success: function () {
            hideModal('delete-group-modal');
            showNotification("Delete Group", "Successfully! Group deleted!");
            getGroupsDataForTable(); // reload table
        }
    });
}