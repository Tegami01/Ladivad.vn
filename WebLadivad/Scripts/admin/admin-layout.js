/// <summary>
/// Admin: LeftMenu
/// </summary>
var getPath = window.location.pathname.toString().toLowerCase();
var fullPath = getPath + decodeURIComponent(window.location.search);


if (getPath.indexOf("/admin/products") != -1) {
    getPath = "/admin/products";
} else if (getPath.indexOf("/admin/collections") != -1) {
    getPath = "/admin/collections";
} else if (getPath.indexOf("/admin/news") != -1) {
    getPath = "/admin/news";
} else if (getPath.indexOf("/admin/customers") != -1) {
    getPath = "/admin/customers";
} else if (getPath == "/admin/discounts/create") {
    getPath = "/admin/discounts";
} else if (getPath.indexOf("/admin/pages") != -1) {
    getPath = "/admin/pages";
} else if (getPath.indexOf("/admin/brands") != -1) {
    getPath = "/admin/brands";
} else if (getPath.indexOf("/admin/suppliers") != -1) {
    getPath = "/admin/suppliers";
} else if (getPath.indexOf("/admin/supports") != -1) {
    getPath = "/admin/supports";
} else if (getPath.indexOf("/admin/orders") != -1) {
    getPath = "/admin/orders";
} else if (getPath.indexOf("/admin/links") != -1) {
    getPath = "/admin/links";
} else if (getPath.indexOf("/admin/staffs") != -1) {
    getPath = "/admin/staffs";
} else if (getPath.indexOf("/admin/schedules") != -1) {
    getPath = "/admin/schedules";
}

$("li.li-left-menu a[href='" + getPath + "']").addClass("_2KqTu _3AeAB");
$("li.li-left-menu a[href='" + getPath + "']").parents().eq(4).show();
$("li.li-left-menu a[href='" + getPath + "']").parents().eq(4).removeClass("hide");
$("li.li-left-menu a[href='" + getPath + "']").parents().eq(5).find("a").first().addClass("_2KqTu _3AeAB");


// Đánh dấu Tab
$("ul.jindo-next-tab li a.next-tab[href='" + fullPath + "']").addClass("next-tab--is-active");



function ClickRow(event) {
    window.location = $(event).data("href");
}


function TransferConfirm(event) {
    var url = $(event).parent().data("href");

    $.ajax({
        url: url,
        type: "POST",
        success: function (data) {
            $('#vnnsoft-modal').html(data);   // Đưa data vào
            $("#vnnsoft-modal").show();       // Show data

            $(".close-modal, #vnnsoft-modal .visible").on("click", function () {
                $("#vnnsoft-modal").hide();
            });
        }
    })
}



function ConfirmModal(form) {
    var data = new FormData($(form)[0]);
    $.validator.unobtrusive.parse(form);

    if ($(form).valid()) {
        console.log(form.action);

        $.ajax({
            type: "POST",
            url: form.action,
            data: data,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.success) {
                    
                }
            }
        })
    } return false;
}


$(".phonenumber").text(function (i, text) {
    text = text.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
    return text.replace(/^0+/, '');
});


