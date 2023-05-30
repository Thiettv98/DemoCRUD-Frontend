$(function () {
    $("#header").load("header.html", function(){
        feather.replace();
    }); 
    $("#left-menu").load("left-menu.html", function(){
        feather.replace();
    }); 

    $("#footer").load("footer.html", function(){
        feather.replace();
    });
    loadGroupPage();
});
function settingCommon() {
    
    $('[data-toggle="tooltip"]').tooltip();
    $('#min-date').datetimepicker({
        format: 'L'
    });
    $('#max-date').datetimepicker({
        format: 'L'
    });
};
let isShow = false;
function toggleFilterForm() {
    if(!isShow){
        $("#filter-form").removeClass("d-none");
        isShow = true;
    }else{
        $("#filter-form").addClass("d-none");
        isShow = false;
    };
};
function loadGroupPage(){
    $("#content").load("groups.html", function(){
        feather.replace();
        settingCommon();
        getGroupsDataForTable();
    }); //default page is group page
};
function loadAccountPage(){
    $("#content").load("account.html", function(){
        feather.replace();
        settingCommon();
    });
};
