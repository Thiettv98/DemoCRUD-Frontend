let updateGroupId;
let oldGroupName;

function openUpdateGroupModal(id) {
    updateGroupId = id;
    showModal('group-modal');
    resetUpdateGroupForm();
    initUpdateGroupFormValidator({
        submitHandler: function () {
            let groupName = $("#group-name-input").val();
            let member = $("#member-input").val();
            let creator = $("#creator-input").val();
            let createdDate = $("#created-date-input").val();
            updateNewGroupInfoToServer(groupName, member, creator, createdDate);
        }
    });
}

function resetUpdateGroupForm() {
    // set title for modal
    $("#group-modal-title").text("Update Group Modal");

    // hide created date field
    $("#created-date-field").removeClass("d-none");

    // reset input value
    $("#group-name-input").val("");
    $("#member-input").val("");
    $("#creator-input").val("");
    // reset validaion
    resetUpdateGroupValidator();

    initSelect2({
        name: 'validation-creator',
        placeholder: "Select creator..."
    });

    getCreatorsFromServer(true);
}

function getDetailGroupFromServer() {
    groupAPI.getDetail({
        groupId: updateGroupId,
        success: function (data) {
            fillDetailGroupToUpdateGroupModal(data);
        }
    });
}

function fillDetailGroupToUpdateGroupModal(group) {
    oldGroupName = group.name;

    $("#group-name-input").val(group.name);
    $("#member-input").val(group.member);
    $("#creator-input").val(group.creator).change();
    $("#created-date-input").val(group.createdDate);
}

function updateNewGroupInfoToServer(groupName, member, creator, createdDate) {
    groupAPI.update({
        groupId: updateGroupId,
        groupName, member, creator, createdDate,
        success: function () {
            hideModal('group-modal');
            showNotification("Update Group", "Successfully! Group updated!");
            getGroupsDataForTable(); // reload table
        }
    });
}