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
    groupAPI.getAll({
        currentPage,
        limit,
        currentSearch,
        currentMinDateFilter,
        currentMaxDateFilter,
        currentMinMemberFilter,
        currentMaxMemberFilter,
        currentFieldSort,
        isSortASC,
        success: function (data, textStatus, response) {
            let totalItems = response.getResponseHeader('x-total-count');
            fillListGroupToTable(data);
            fillPaginationToTable(totalItems)
        }
    });
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
                        <a href="#" class="mr-2" onclick="openUpdateGroupModal(${group.id})">
                        <i class="align-middle" data-feather="edit-2"></i>
                    </a>
                    <a href="#" onclick="openDeleteGroupModal(${group.id}, '${group.name}')">
                        <i class="align-middle" data-feather="trash"></i>
                    </a>
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
}

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
        getGroupsDataForTable(); // reload table
    }
}

let isShowGroupFilter = false;
function toggleFilterForm() {
    if (!isShowGroupFilter) {
        $("#filter-form").removeClass("d-none");
        isShowGroupFilter = true;
    } else {
        $("#filter-form").addClass("d-none");
        isShowGroupFilter = false;
    }
}

function changeFilter() {
    let inputMinDate = $("#min-date-input").val();
    let inputMaxDate = $("#max-date-input").val();
    let inputMinMember = $("#min-member-input").val();
    let inputMaxMember = $("#max-member-input").val();
    console.log(inputMinDate);

    // validate
    let hasError = false;

    const minDate = !inputMinDate ? null : moment(inputMinDate, 'YYYY-MM-DD').toDate();
    const maxDate = !inputMaxDate ? null : moment(inputMaxDate, 'YYYY-MM-DD').toDate();

    if (minDate && minDate > new Date()) {
        showErrorMessage('min-date-input', 'validation-min-date-error');
        hasError = true;
    } else {
        hideErrorMessage('min-date-input', 'validation-min-date-error');
    }

    if (minDate && maxDate && minDate > maxDate) {
        showErrorMessage('max-date-input', 'validation-max-date-error');
        hasError = true;
    } else {
        hideErrorMessage('max-date-input', 'validation-max-date-error');
    }

    if (inputMinMember && Number(inputMinMember) < 0) {
        showErrorMessage('min-member-input', 'validation-min-member-error');
        hasError = true;
    } else {
        hideErrorMessage('min-member-input', 'validation-min-member-error');
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
        hideErrorMessage('max-member-input', 'validation-max-member-error');
    }

    if (hasError) return;

    // changed filter
    if (inputMinDate != currentMinDateFilter || inputMaxDate != currentMaxDateFilter
        || inputMinMember != currentMinMemberFilter || inputMaxMember != currentMaxMemberFilter
    ) {
        currentMinDateFilter = inputMinDate;
        currentMaxDateFilter = inputMaxDate;
        currentMinMemberFilter = inputMinMember;
        currentMaxMemberFilter = inputMaxMember;

        resetPaging();
        getGroupsDataForTable(); // reload table
    }
}
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
