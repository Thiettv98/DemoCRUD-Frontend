$(function () {
    if (!storage.isLogin()) {
        location.href = '../pages/auth/login.html';
        return;
    }

    $("#header").load("./header.html", function () {
        feather.replace();
        $("#header-fullname").text(storage.getFullName());
    });
    $("#left-menu").load("./left-menu.html", function () {
        feather.replace();
        $("#left-menu-fullname").text(storage.getFullName());
    });

    $("#footer").load("./footer.html", function () {
        feather.replace();
    });

    loadGroupPage(); // the default page is group page 
});

function logout() {
    storage.removeUserInfo();
    location.href = '../pages/auth/login.html';
}
function toggleLeftMenu() {
    if ($("#left-menu").hasClass("toggled")) {
        $("#left-menu").removeClass("toggled");
    } else {
        $("#left-menu").addClass("toggled");
    }
}