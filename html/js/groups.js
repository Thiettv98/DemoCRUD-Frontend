let baseUrl = 'http://localhost:3000/api/v1';
let groupBaseUrl = `${baseUrl}/groups`;
let creatorsBaseUrl = `${baseUrl}/creators`;

let currentPage = 1;
let limit = 5;

let currentSearch = "";

let currentMinDateFilter = "";
let currentMaxDateFilter = "";
let currentMinMemberFilter = "";
let currentMaxMemberFilter = "";

let currentFieldSort = "id";
let isSortASC = false;

function getGroupsDataForTable() {
    let url = `${groupBaseUrl}?_page=${currentPage}&_limit=${limit}`;
    //sort
    if (currentFieldSort) {
        url += `&_sort=${currentFieldSort}&_order=${isSortASC ? "ASC" : "DESC"}`;
    }

    if (currentSearch) {
        url += `&q=${currentSearch}`;

    }

    // filter
    if (currentMinDateFilter) {
        url += `&createdDate_gte=${currentMinDateFilter}`;
    }

    if (currentMaxDateFilter) {
        url += `&createdDate_lte=${currentMaxDateFilter}`;
    }

    if (currentMinMemberFilter) {
        url += `&member_gte=${currentMinMemberFilter}`;
    }

    if (currentMaxMemberFilter) {
        url += `&member_lte=${currentMaxMemberFilter}`;
    }

    $.ajax({
        url: url,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json',
        success: function (data, textStatus, response) {
            // success
            let totalItems = response.getResponseHeader('x-total-count');
            fillListGroupToTable(data);
            fillPaginationToTable(totalItems)
        },
        error(jqXHR, textStatus, errorThrown) {
            // error
            showNotification("Get List Group", "Fail! There is a error!", false);
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
function getCreatorsFormServer(isUpdate){
    $.ajax({
        url: creatorsBaseUrl,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json',
        success: function (data, textStatus, response) {
            // success
            let totalItems = response.getResponseHeader('x-total-count');
            fillCreatorsToSelectGroupOfAddGroupModal(data);
            getDetailGroupFromServer();
        },
        error(jqXHR, textStatus, errorThrown) {
            // error
            showNotification("Get List Group", "Fail! There is a error!", false);
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
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

function fillListGroupToTable(groups) {
    let rows = "";

    for (const group of groups) {
        let row = `<tr>
                        <td class="text-center"><input type="checkbox"></td>
                        <td>${group.name}</td>
                        <td>${group.member}</td>
                        <td>${group.creator}</td>
                        <td class="d-none d-md-table-cell">${group.createdDate}</td>
                        <td class="table-action text-center">
                            <a href="#" onclick="openUpdateGroupModal(${group.id})">
                            <i class="align-middel" data-feather="edit-2"></i></a>
                            <a href="#"><i class="align-middel" data-feather="trash"></i></a>
                        </td>
                   </tr>`;
        rows += row;
    }
    $('#group-table-body').empty();
    $('#group-table-body').append(rows);
    feather.replace();
}

function fillPaginationToTable(totalItems) {
    let totalPages = Math.ceil(totalItems / limit);

    let rows = "";

    // previous
    rows += `<li class="page-item ${currentPage == 1 ? "disabled" : ""}" onclick="changePage(${currentPage - 1}, ${totalPages})">
                <a class="page-link" href="#">Previous</a>
            </li>`;

    for (let i = 1; i <= totalPages; i++) {
        let row = `<li class="page-item ${currentPage == i ? "active" : ""}" onclick="changePage(${i}, ${totalPages})">
                        <a class="page-link" href="#">${i}</a>
                    </li>`;
        rows += row;
    }

    rows += `<li class="page-item ${currentPage == totalPages ? "disabled" : ""}" onclick="changePage(${currentPage + 1}, ${totalPages})">
                <a class="page-link" href="#">Next</a>
            </li>`;


    $('#group-pagination').empty();
    $('#group-pagination').append(rows);
};

function changePage(newPage, totalPages) {
    if (newPage == currentPage || newPage < 1 || newPage > totalPages) {
        return;
    }
    currentPage = newPage;
    getGroupsDataForTable(); // reload table
};
function changeSearch() {
    let inputSearch = $("#group-search").val();
    if (inputSearch != currentSearch) {
        currentSearch = inputSearch;
        resetPaging();
        getGroupsDataForTable();
    }
};

function changeFilter() {
    let inputMinDate = $("#min-date-input").val();
    let inputMaxDate = $("#max-date-input").val();
    let inputMinMember = $("#min-member-input").val();
    let inputMaxMember = $("#max-member-input").val();

    // validate
    let hasError = false;

    const minDate = !inputMinDate ? null : moment(inputMinDate, 'YYYY-MM-DD').toDate();
    const maxDate = !inputMaxDate ? null : moment(inputMaxDate, 'YYYY-MM-DD').toDate();

    if (minDate && minDate > new Date()) {
        showErrorMessage('min-date-input', 'validation-min-date-error');
        hasError = true;
    } else {
        hideErrorMessage('min-date-input');
    };

    if (minDate && maxDate && minDate > maxDate) {
        showErrorMessage('max-date-input', 'validation-max-date-error');
        hasError = true;
    } else {
        hideErrorMessage('max-date-input');
    };


    if (Number(inputMinMember) & Number(inputMinMember) < 0) {
        showErrorMessage('min-member-input');
        hasError = true;
    } else {
        hideErrorMessage('min-member-input');
    }
    if (inputMaxMember && Number(inputMaxMember) < 0) {
        showErrorMessage(
            'max-member-input',
            'validation-max-member-error',
            "Max member must be greater than or equal 0");
        hasError = true;
    } else if (inputMaxMember && inputMinMember && Number(inputMaxMember) < Number(inputMinMember)) {
        showErrorMessage(
            'max-member-input',
            'validation-max-member-error',
            "Max member must be greater than or equal min member");
        hasError = true;
    } else {
        hideErrorMessage('max-member-input');
    }
    if (hasError) return;

    // Change Filter

    if (inputMinDate != currentMinDateFilter || inputMaxDate != currentMaxDateFilter
        || inputMinMember != currentMinMemberFilter || inputMaxMember != currentMaxMemberFilter
    ) {
        currentMinDateFilter = inputMinDate;
        currentMaxDateFilter = inputMaxDate;
        currentMinMemberFilter = inputMinMember;
        currentMaxMemberFilter = inputMaxMember;
        resetPaging();
        getGroupsDataForTable(); //reload table
    };
};
function showErrorMessage(idInput, idLabel, errorMessage) {
    $(`#${idInput}`).addClass("is-invalid");
    if (errorMessage) {
        $(`#${idLabel}`).text(errorMessage);
    }
};
function hideErrorMessage(idInput) {
    $(`#${idInput}`).removeClass("is-invalid");
};

function changeSort(field) {
    if (field == currentFieldSort) {
        isSortASC = !isSortASC;
    } else {
        currentFieldSort = field;
        isSortASC = true;
    }
    //binding UI
    switch (currentFieldSort) {
        case 'name':
            showSortIcon('group-name-sort-icon');
            break;
        case 'member':
            showSortIcon('member-sort-icon');
            break;
        case 'creator':
            showSortIcon('creator-sort-icon');
            break;
        case 'createdDate':
            showSortIcon('created-date-sort-icon');
            break;
        default:
            break;
    }
    resetPaging();
    getGroupsDataForTable();//reload table
}

function showSortIcon(idSortIcon) {
    hideAllSortIcon();
    $(`#${idSortIcon}`).removeClass("d-none");
    //set icon
    $(`#${idSortIcon}`).empty();
        $(`#${idSortIcon}`).prepend(`<i data-feather="${isSortASC ? "chevron-up":"chevron-down"}"></i>`)
        feather.replace();
};
function hideSortIcon(idSortIcon) {
    $(`#${idSortIcon}`).addClass("d-none");
}
function hideAllSortIcon() {
    hideSortIcon('group-name-sort-icon');
    hideSortIcon('member-sort-icon');
    hideSortIcon('creator-sort-icon');
    hideSortIcon('created-date-sort-icon');
}
function refreshTable(){
    resetPaging();
    resetSearch();
    resetFilter();
    resetSort();

    getGroupsDataForTable();//reload table
}

function resetPaging(){
    currentPage = 1;
}

function resetSearch(){
    currentSearch = "";
$("#group-search").val("");
}

function resetFilter(){
currentMinDateFilter = "";
currentMaxDateFilter = "";
currentMinMemberFilter = "";
currentMaxMemberFilter = "";

$("#min-date-input").val("");
$("#max-date-input").val("");
$("#min-member-input").val("");
$("#max-member-input").val("");

hideErrorMessage('min-date-input');
hideErrorMessage('max-date-input');
hideErrorMessage('min-member-input');
hideErrorMessage('max-member-input');
}
function resetSort(){
currentFieldSort ="";
isSortASC = "";

hideAllSortIcon();
}
function openAddGroupModal() {
    $('#group-modal').modal('show');
    resetAddGroupForm();
    initValidateForAddGroup();
}

function resetAddGroupForm() {

    // set title for modal
    $("#group-modal-title").text("Add Group Modal");

    // hide created date field
    $("#created-date-field").addClass("d-none");

    // reset input value
    $("#group-name-input").val("");
    $("#member-input").val("");
    $("#creator-input").val("");
    // reset validaion
    if (addGroupFormValidator) {
        addGroupFormValidator.data("validator").resetForm();
        $("input").removeClass("is-invalid");
    }
    getCreatorsFromServer(false);
}

function getCreatorsFromServer(isUpdateModal) {
    $.ajax({
        url: creatorsBaseUrl,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json',
        success: function (data, textStatus, response) {
            // success
            fillCreatorsToSelectGroupOfAddGroupModal(data, isUpdateModal);
        },
        error(jqXHR, textStatus, errorThrown) {
            // error
            showNotification("Get List Group", "Fail! There is a error!", false);
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
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

let addGroupFormValidator;

function initValidateForAddGroup() {
    // Initialize Select2 select box
    $("select[name=\"validation-creator\"]").select2({
        allowClear: true,
        placeholder: "Select creator...",
    }).change(function () {
        $(this).valid();
    });

    // Initialize validation
    addGroupFormValidator = $("#group-form");
    addGroupFormValidator.validate({
        rules: {
            "validation-group-name": {
                required: true,
                minlength: 6,
                maxlength: 20,
                remote: {
                    url: groupBaseUrl,
                    type: "GET",
                    data: {
                        name: function () {
                            return $("#group-name-input").val();
                        }
                    },
                    dataFilter: function (data) {
                        var groups = JSON.parse(data);
                        return groups.length == 0;
                    }
                }
            },
            "validation-member": {
                required: true,
                min: 0
            },
            "validation-creator": {
                required: true
            }
        },
        messages: {
            "validation-group-name": {
                required: "Enter a name",
                minlength: jQuery.validator.format("Enter at least {0} characters"),
                maxlength: jQuery.validator.format("Enter max {0} characters"),
                remote: jQuery.validator.format("{0} is already in use")
            }
        },
        submitHandler: function (form) {
            let newGroupName = $("#group-name-input").val();
            let member = $("#member-input").val();
            let creator = $("#creator-input").val();
            insertNewGroupToServer(newGroupName, member, creator);
            return false;
        },
        onkeyup: false,
        // Errors
        errorPlacement: function errorPlacement(error, element) {
            var $parent = $(element).parents(".form-group");
            // Do not duplicate errors
            if ($parent.find(".jquery-validation-error").length) {
                return;
            }
            $parent.append(
                error.addClass("jquery-validation-error small form-text invalid-feedback")
            );
        },
        highlight: function (element) {
            var $el = $(element);
            var $parent = $el.parents(".form-group");
            $el.addClass("is-invalid");
            // Select2 and Tagsinput
            if ($el.hasClass("select2-hidden-accessible") || $el.attr("data-role") === "tagsinput") {
                $el.parent().addClass("is-invalid");
            }
        },
        unhighlight: function (element) {
            $(element).parents(".form-group").find(".is-invalid").removeClass("is-invalid");
        }
    });
}

function insertNewGroupToServer(newGroupName, member, creator) {
    let newGroup = {
        "name": newGroupName,
        "member": member,
        "creator": creator,
        "createdDate": moment(new Date()).format('YYYY-MM-DD')
    };

    $.ajax({
        url: groupBaseUrl,
        type: 'POST',
        data: JSON.stringify(newGroup), // body
        contentType: "application/json",
        dataType: 'json',
        success: function (data, textStatus, response) {
            // success
            console.log("success");
            $('#group-modal').modal('hide');
            showNotification("Create new Group", "Successfully! New group created!");
            getGroupsDataForTable(); // reload table
        },
        error(jqXHR, textStatus, errorThrown) {
            showNotification("Create new Group", "Fail! There is a error!", false);
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function showNotification(message, title, isSuccess = true) {
    var type = isSuccess ? "success" : "error";

    toastr[type](message, title, {
        closeButton: true,
        newestOnTop: true,
        rtl: $("body").attr("dir") === "rtl" || $("html").attr("dir") === "rtl",
        timeOut: 2500
    });
}

let updateGroupId;
function openUpdateGroupModal(id) {
    updateGroupId = id;
    $('#group-modal').modal('show');
    resetUpdateGroupForm();
    initValidateForUpdateGroup();
}

let updateGroupFormValidator;

function resetUpdateGroupForm() {

    // set title for modal
    $("#group-modal-title").text("Update Group Modal");

    // show created date field
    $("#created-date-field").removeClass("d-none");

    // reset input value
    $("#group-name-input").val("");
    $("#member-input").val("");
    $("#creator-input").val("");
    // reset validaion
    if (updateGroupFormValidator) {
        updateGroupFormValidator.data("validator").resetForm();
        $("input").removeClass("is-invalid");
    }
    getCreatorsFromServer(true);
}

function getDetailGroupFromServer() {
    $.ajax({
        url: `${groupBaseUrl}/${updateGroupId}`,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json',
        success: function (data, textStatus, response) {
            // success
            fillDetailGroupToUpdateGroupModal(data);
        },
        error(jqXHR, textStatus, errorThrown) {
            // error
            showNotification("Get Detail Group", "Fail! There is a error!", false);
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

let oldGroupName;
function fillDetailGroupToUpdateGroupModal(group) {
    oldGroupName = group.name;

    $("#group-name-input").val(group.name);
    $("#member-input").val(group.member);
    $("#creator-input").val(group.creator).change();
    $("#created-date-input").val(group.createdDate);
}

function initValidateForUpdateGroup() {
    // Initialize Select2 select box
    $("select[name=\"validation-creator\"]").select2({
        allowClear: true,
        placeholder: "Select creator...",
    }).change(function () {
        $(this).valid();
    });

    // Initialize validation
    updateGroupFormValidator = $("#group-form");
    updateGroupFormValidator.validate({
        rules: {
            "validation-group-name": {
                required: true,
                minlength: 6,
                maxlength: 20,
                remote: {
                    url: groupBaseUrl,
                    type: "GET",
                    data: {
                        name: function () {
                            return $("#group-name-input").val();
                        }
                    },
                    dataFilter: function (data) {
                        var groups = JSON.parse(data);
                        if (oldGroupName == $("#group-name-input").val()) {
                            return true;
                        }
                        return groups.length == 0;
                    }
                }
            },
            "validation-member": {
                required: true,
                min: 0
            },
            "validation-creator": {
                required: true
            }
        },
        messages: {
            "validation-group-name": {
                required: "Enter a name",
                minlength: jQuery.validator.format("Enter at least {0} characters"),
                maxlength: jQuery.validator.format("Enter max {0} characters"),
                remote: jQuery.validator.format("{0} is already in use")
            }
        },
        submitHandler: function (form) {
            let groupName = $("#group-name-input").val();
            let member = $("#member-input").val();
            let creator = $("#creator-input").val();
            let createdDate = $("#created-date-input").val();
            updateNewGroupInfoToServer(groupName, member, creator, createdDate);
            return false;
        },
        onkeyup: false,
        // Errors
        errorPlacement: function errorPlacement(error, element) {
            var $parent = $(element).parents(".form-group");
            // Do not duplicate errors
            if ($parent.find(".jquery-validation-error").length) {
                return;
            }
            $parent.append(
                error.addClass("jquery-validation-error small form-text invalid-feedback")
            );
        },
        highlight: function (element) {
            var $el = $(element);
            var $parent = $el.parents(".form-group");
            $el.addClass("is-invalid");
            // Select2 and Tagsinput
            if ($el.hasClass("select2-hidden-accessible") || $el.attr("data-role") === "tagsinput") {
                $el.parent().addClass("is-invalid");
            }
        },
        unhighlight: function (element) {
            $(element).parents(".form-group").find(".is-invalid").removeClass("is-invalid");
        }
    });
}


function updateNewGroupInfoToServer(groupName, member, creator, createdDate) {
    let newGroupInfo = {
        "name": groupName,
        "member": member,
        "creator": creator,
        "createdDate": createdDate
    };

    $.ajax({
        url: `${groupBaseUrl}/${updateGroupId}`,
        type: 'PUT',
        data: JSON.stringify(newGroupInfo), // body
        contentType: "application/json",
        dataType: 'json',
        success: function (data, textStatus, response) {
            // success
            $('#group-modal').modal('hide');
            showNotification("Update Group", "Successfully! Group updated!");
            getGroupsDataForTable(); // reload table
        },
        error(jqXHR, textStatus, errorThrown) {
            showNotification("Update Group", "Fail! There is a error!", false);
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
let deleteGroupId;
function openDeleteGroupModal(id, name) {
    deleteGroupId = id;
    $('#delete-group-modal').modal('show');
    $("#delete-group-name").text(name);
}

function deleteGroupFromServer() {
    $.ajax({
        url: `${groupBaseUrl}/${deleteGroupId}`,
        type: 'DELETE',
        success: function (data, textStatus, response) {
            // success
            $('#delete-group-modal').modal('hide');
            showNotification("Delete Group", "Successfully! Group deleted!");
            getGroupsDataForTable(); // reload table
        },
        error(jqXHR, textStatus, errorThrown) {
            showNotification("Delete Group", "Fail! There is a error!", false);
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}