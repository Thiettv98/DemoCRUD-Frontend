let currentPage = 1;
let limit = 5;

function getGroupsDataForTable() {
    $.ajax({
        url: `http://localhost:3000/api/v1/groups?_page=${currentPage}&_limit=${limit}`,
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
}

function changePage(newPage, totalPages) {
    if (newPage == currentPage || newPage < 1 || newPage > totalPages) {
        return;
    }
    currentPage = newPage;
    getGroupsDataForTable(); // reload table
}