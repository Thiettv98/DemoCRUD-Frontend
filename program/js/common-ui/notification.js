function showNotification(message, title, isSuccess = true) {
    var type = isSuccess ? "success" : "error";

    toastr[type](message, title, {
        closeButton: true,
        newestOnTop: true,
        rtl: $("body").attr("dir") === "rtl" || $("html").attr("dir") === "rtl",
        timeOut: 2500
    });
}