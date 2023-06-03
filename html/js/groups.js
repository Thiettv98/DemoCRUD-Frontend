let baseUrl = 'http://localhost:3000/api/v1/groups';
let currentPage = 1;
let limit = 5;
let currentSearch = "";

let currentMinDateFilter = "";
let currentMaxDateFilter = "";
let currentMinMemberFilter = "";
let currentMaxMemberFilter = "";

let currentFieldSort = "";
let isSortASC = "";

function getGroupsDataForTable() {
    let url = `${baseUrl}?_page=${currentPage}&_limit=${limit}`;
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
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
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
                   </tr>`;
        rows += row;
    }
    $('#group-table-body').empty();
    $('#group-table-body').append(rows);
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
}

function showSortIcon(idSortIcon) {
    hideAllSortIcon();
    $(`#${idSortIcon}`).removeClass("d-none");
    //set icon
    $(`#${idSortIcon}`).empty();
        $(`#${idSortIcon}`).prepend(`<i data-feather="${isSortASC ? "chevron-up":"chevron-down"}"></i>`)
        feather.replace();
    getGroupsDataForTable();//reload table
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