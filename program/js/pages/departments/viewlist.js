function getDepartmentsDataForTable() {
    departmentAPI.getAll({
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
            fillListDepartmentToTable(data);
            fillPaginationToTable(totalItems)
        }
    });
}
function fillListDepartmentToTable(departments) {
    let rows = "";

    for (const department of departments) {
        let row = `<tr>
                        <td class="text-center"><input type="checkbox"></td>
                        <td>${department.name}</td>
                        <td>${department.manager}</td>
                        <td>${department.member}</td>
                        <td>${department.creator}</td>
                        <td class="d-none d-md-table-cell">${department.createdDate}</td>
                        <td class="table-action text-center">
                        <a href="#" class="mr-2" onclick="openUpdateDepartmentModal(${department.id})">
                        <i class="align-middle" data-feather="edit-2"></i>
                    </a>
                    <a href="#" onclick="openDeleteDepartmentModal(${department.id}, '${department.name}')">
                        <i class="align-middle" data-feather="trash"></i>
                    </a>
                </td>
                   </tr>`;
        rows += row;
    }
    $('#department-table-body').empty();
    $('#department-table-body').append(rows);
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


    $('#department-pagination').empty();
    $('#department-pagination').append(rows);
}

function changePage(newPage, totalPages) {
    if (newPage == currentPage || newPage < 1 || newPage > totalPages) {
        return;
    }
    currentPage = newPage;
    getDepartmentsDataForTable(); // reload table
};
function changeSearch() {
    let inputSearch = $("#department-search").val();
    if (inputSearch != currentSearch) {
        currentSearch = inputSearch;
        resetPaging();
        getDepartmentsDataForTable(); // reload table
    }
}

let isShowDepartmentFilter = false;
function toggleFilterForm() {
    if (!isShowDepartmentFilter) {
        $("#filter-form").removeClass("d-none");
        isShowDepartmentFilter = true;
    } else {
        $("#filter-form").addClass("d-none");
        isShowDepartmentFilter = false;
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
        getDepartmentsDataForTable(); // reload table
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

function changeSortDepartment(field) {
    if (field == currentFieldSort) {
        isSortASC = !isSortASC;
    } else {
        currentFieldSort = field;
        isSortASC = true;
    }
    //binding UI
    switch (currentFieldSort) {
        case 'name':
            showSortIcon('department-name-sort-icon');
            break;
        case 'manager':
            showSortIcon('manager-sort-icon');
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
    getDepartmentsDataForTable();//reload table
}

function showSortIconDepartment(idSortIcon) {
    hideAllSortIcon();
    $(`#${idSortIcon}`).removeClass("d-none");
    //set icon
    $(`#${idSortIcon}`).empty();
    $(`#${idSortIcon}`).prepend(`<i data-feather="${isSortASC ? "chevron-up" : "chevron-down"}"></i>`)
    feather.replace();
};
function hideSortIconDepartment(idSortIcon) {
    $(`#${idSortIcon}`).addClass("d-none");
}
function hideAllSortIcon() {
    hideSortIconDepartment('department-name-sort-icon');
    hideSortIconDepartment('manager-sort-icon');
    hideSortIconDepartment('member-sort-icon');
    hideSortIconDepartment('creator-sort-icon');
    hideSortIconDepartment('created-date-sort-icon');
}
function refreshTable() {
    resetPaging();
    resetSearch();
    resetFilter();
    resetSort();

    getDepartmentsDataForTable();//reload table
}

function resetPaging() {
    currentPage = 1;
}

function resetSearch() {
    currentSearch = "";
    $("#department-search").val("");
}

function resetFilter() {
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
function resetSort() {
    currentFieldSort = "";
    isSortASC = "";

    hideAllSortIcon();
}
