function openAddGroupModal() {
    showModal('group-modal');
    resetAddGroupForm();
    initAddGroupFormValidator({
        submitHandler: function () {
            let newGroupName = $("#group-name-input").val();
            let member = $("#member-input").val();
            let creator = $("#creator-input").val();
            insertNewGroupToServer(newGroupName, member, creator);
        }
    });
}

function resetAddGroupForm() {
    // set title for modal
    $("#group-modal-title").text("Add Group Modal");

    // hide created date field
    $("#created-date-field").addClass("d-none");

    

    // reset input
    $("#group-name-input").val("");
    $("#member-input").val("");
    $("#creator-input").val("");

    // reset validator
    resetAddGroupValidator();

    initSelect2({
        name: 'validator-creator',
        placehoder: "Select creator..."
    })
    getCreatorsFromServer(false);
}


function insertNewGroupToServer(groupName, member, creator) {
    groupAPI.insert({
        groupName, member, creator,
        success: function () {
            hideModal('group-modal');
            showNotification("Create new Group", "Successfully! New group created!");
            getGroupsDataForTable(); // reload table
        }
    });
}