function initSelect2({ name, placeholder }) {
    $(`select[name=\"${name}\"]`).select2({
        allowClear: true,
        placeholder: placeholder,
    }).change(function () {
        $(this).valid();
    });
}