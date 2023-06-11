function getCreatorsFromServer(isUpdateModal) {
    creatorAPI.getAll({
        success: function (data) {
            // success
            fillCreatorsToSelectGroupOfAddGroupModal(data, isUpdateModal);
        },
    });
}

function fillCreatorsToSelectGroupOfAddGroupModal(creators, isUpdateModal) {
    let rows = "<option value=''>Select creator...</option>";

    for (const creator of creators) {
        let row = `<option value="${creator}">${creator}</option>`;
        rows += row;
    }
    $('#creator-input').empty();
    $('#creator-input').append(rows);
    if (isUpdateModal) getDetailGroupFromServer();
}