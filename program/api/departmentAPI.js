let departmentBaseUrl = `${baseUrl}/departments`;

let departmentAPI = {
    getAll: function ({
        currentPage,
        limit,
        currentSearch,
        currentMinDateFilter,
        currentMaxDateFilter,
        currentMinMemberFilter,
        currentMaxMemberFilter,
        currentFieldSort,
        isSortASC,
        success }) {

        let url = `${departmentBaseUrl}?_page=${currentPage}&_limit=${limit}`;

        // search
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

        // sort
        if (currentFieldSort) {
            url += `&_sort=${currentFieldSort}&_order=${isSortASC ? "ASC" : "DESC"}`;
        }

        $.ajax({
            url: url,
            type: 'GET',
            contentType: "application/json",
            dataType: 'json',
            success: success,
            error(jqXHR, textStatus, errorThrown) {
                // error
                showNotification("Get List Department", "Fail! There is a error!", false);
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    },
    getDetail: function ({ departmentId, success }) {
        $.ajax({
            url: `${departmentBaseUrl}/${departmentId}`,
            type: 'GET',
            contentType: "application/json",
            dataType: 'json',
            success: success,
            error(jqXHR, textStatus, errorThrown) {
                // error
                showNotification("Get Detail Department", "Fail! There is a error!", false);
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    },
    insert: function ({ departmentName, manager, success }) {
        let newDepartment = {
            "name": departmentName,
            "manager": manager,
            "member": 1,
            "creator": storage.getFullName(),
            "createdDate": moment(new Date()).format('YYYY-MM-DD')
        };

        $.ajax({
            url: departmentBaseUrl,
            type: 'POST',
            data: JSON.stringify(newDepartment), // body
            contentType: "application/json",
            dataType: 'json',
            success: success,
            error(jqXHR, textStatus, errorThrown) {
                showNotification("Create new Department", "Fail! There is a error!", false);
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    },
    update: function ({ departmentId, departmentName, manager, member, creator, createdDate, success }) {
        let newDepartmentInfo = {
            "name": departmentName,
            "manager": manager,
            "member": member,
            "creator": creator,
            "createdDate": createdDate
        };

        $.ajax({
            url: `${departmentBaseUrl}/${departmentId}`,
            type: 'PUT',
            data: JSON.stringify(newDepartmentInfo), // body
            contentType: "application/json",
            dataType: 'json',
            success: success,
            error(jqXHR, textStatus, errorThrown) {
                showNotification("Update Department", "Fail! There is a error!", false);
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    },
    delete: function ({ departmentId, success }) {
        $.ajax({
            url: `${departmentBaseUrl}/${departmentId}`,
            type: 'DELETE',
            success: success,
            error(jqXHR, textStatus, errorThrown) {
                showNotification("Delete Department", "Fail! There is a error!", false);
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }
}