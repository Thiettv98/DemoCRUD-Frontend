let baseUrl = 'http://localhost:3000/api/v1';
let groupBaseUrl = `${baseUrl}/groups`;

let groupAPI = {
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

        let url = `${groupBaseUrl}?_page=${currentPage}&_limit=${limit}`;

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
                showNotification("Get List Group", "Fail! There is a error!", false);
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    },
    getDetail: function ({ groupId, success }) {
        $.ajax({
            url: `${groupBaseUrl}/${groupId}`,
            type: 'GET',
            contentType: "application/json",
            dataType: 'json',
            success: success,
            error(jqXHR, textStatus, errorThrown) {
                // error
                showNotification("Get Detail Group", "Fail! There is a error!", false);
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    },
    insert: function ({ groupName, member, creator, success }) {
        let newGroup = {
            "name": groupName,
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
            success: success,
            error(jqXHR, textStatus, errorThrown) {
                showNotification("Create new Group", "Fail! There is a error!", false);
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    },
    update: function ({ groupId, groupName, member, creator, createdDate, success }) {
        let newGroupInfo = {
            "name": groupName,
            "member": member,
            "creator": creator,
            "createdDate": createdDate
        };

        $.ajax({
            url: `${groupBaseUrl}/${groupId}`,
            type: 'PUT',
            data: JSON.stringify(newGroupInfo), // body
            contentType: "application/json",
            dataType: 'json',
            success: success,
            error(jqXHR, textStatus, errorThrown) {
                showNotification("Update Group", "Fail! There is a error!", false);
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    },
    delete: function ({ groupId, success }) {
        $.ajax({
            url: `${groupBaseUrl}/${groupId}`,
            type: 'DELETE',
            success: success,
            error(jqXHR, textStatus, errorThrown) {
                showNotification("Delete Group", "Fail! There is a error!", false);
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }
}