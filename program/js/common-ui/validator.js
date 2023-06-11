let loginFormValidator;
let addGroupFormValidator;
let updateGroupFormValidator;

function initBaseValidator({ formValidator, rules, messages, submitHandler }) {
    return formValidator.validate({
        rules: rules,
        messages: messages,
        submitHandler: function (form) {
            submitHandler();
            return false;
        },
        // Errors
        errorPlacement: function errorPlacement(error, element) {
            var $parent = $(element).parents(".form-group");
            // Do not duplicate errors
            if ($parent.find(".jquery-validation-error").length) {
                return;
            }
            $parent.append(
                error.addClass("jquery-validation-error small form-text invalid-feedback")
            );
        },
        highlight: function (element) {
            var $el = $(element);
            var $parent = $el.parents(".form-group");
            $el.addClass("is-invalid");
            // Select2 and Tagsinput
            if ($el.hasClass("select2-hidden-accessible") || $el.attr("data-role") === "tagsinput") {
                $el.parent().addClass("is-invalid");
            }
        },
        unhighlight: function (element) {
            $(element).parents(".form-group").find(".is-invalid").removeClass("is-invalid");
        }
    });
}

function resetVaildator(formValidator) {
    if (formValidator) {
        formValidator.resetForm();
        $("input").removeClass("is-invalid");
    }
}

function initLoginFormValidator({ submitHandler }) {
    loginFormValidator = $("#login-form");
    loginFormValidator = initBaseValidator({
        formValidator: loginFormValidator,
        rules: {
            "validation-username": {
                required: true
            },
            "validation-password": {
                required: true
            }
        },
        submitHandler
    });
}

function initAddGroupFormValidator({ submitHandler }) {
    addGroupFormValidator = $("#group-form");
    addGroupFormValidator = initBaseValidator({
        formValidator: addGroupFormValidator,
        rules: {
            "validation-group-name": {
                required: true,
                minlength: 6,
                maxlength: 20,
                remote: {
                    url: groupBaseUrl,
                    type: "GET",
                    data: {
                        name: function () {
                            return $("#group-name-input").val();
                        }
                    },
                    dataFilter: function (data) {
                        var groups = JSON.parse(data);
                        return groups.length == 0;
                    }
                }
            },
            "validation-member": {
                required: true,
                min: 0
            },
            "validation-creator": {
                required: true
            }
        },
        messages: {
            "validation-group-name": {
                required: "Enter a name",
                minlength: jQuery.validator.format("Enter at least {0} characters"),
                maxlength: jQuery.validator.format("Enter max {0} characters"),
                remote: jQuery.validator.format("{0} is already in use")
            }
        },
        submitHandler
    });
}

function resetAddGroupValidator() {
    resetVaildator(addGroupFormValidator);
}

function initUpdateGroupFormValidator({ submitHandler }) {
    updateGroupFormValidator = $("#group-form");
    updateGroupFormValidator = initBaseValidator({
        formValidator: updateGroupFormValidator,
        rules: {
            "validation-group-name": {
                required: true,
                minlength: 6,
                maxlength: 20,
                remote: {
                    url: groupBaseUrl,
                    type: "GET",
                    data: {
                        name: function () {
                            return $("#group-name-input").val();
                        }
                    },
                    dataFilter: function (data) {
                        var groups = JSON.parse(data);
                        if (oldGroupName == $("#group-name-input").val()) {
                            return true;
                        }
                        return groups.length == 0;
                    }
                }
            },
            "validation-member": {
                required: true,
                min: 0
            },
            "validation-creator": {
                required: true
            }
        },
        messages: {
            "validation-group-name": {
                required: "Enter a name",
                minlength: jQuery.validator.format("Enter at least {0} characters"),
                maxlength: jQuery.validator.format("Enter max {0} characters"),
                remote: jQuery.validator.format("{0} is already in use")
            }
        },
        submitHandler
    });
}

function resetUpdateGroupValidator() {
    resetVaildator(updateGroupFormValidator);
}