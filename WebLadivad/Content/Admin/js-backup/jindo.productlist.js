var idSelected = new Array();


function SelectItem(check) {


    if ($(check).attr("checked") == "checked") {
        $(check).attr("checked", false);
        $(check).parents().eq(2).removeClass("selected");
    } else {
        $(check).attr("checked", true);
        $(check).parents().eq(2).addClass("selected");
    }

    idSelected = [];
    $("#all-products tbody tr").each(function (i, val) {
        if ($(val).find(".product-check").attr("checked") == "checked") {
            idSelected.push($(val).find(".product-check").val());
        }
    });

    HeaderSelectBar(idSelected.length);

    //console.log(productIdSelected);
}


function HeaderSelectBar(length) {
    if (length > 0) {
        $(".jindo-select-all").addClass("bulk-actions__select-all--has-selected-items");
        $(".tooltip-container").addClass("hide");
        $(".bulk-actions").addClass("bulk-actions--is-visible");
        $(".jindo-select-label").removeClass("bulk-actions__select-all-btn btn-slim btn next-label next-label--switch");
        $("#CountProduct").html(length);
    } else {
        $(".jindo-select-all").removeClass("bulk-actions__select-all--has-selected-items");
        $(".tooltip-container").removeClass("hide");
        $(".bulk-actions").removeClass("bulk-actions--is-visible");
        $(".jindo-select-label").addClass("bulk-actions__select-all-btn btn-slim btn next-label next-label--switch");
    }
}


$("#jindo-action-button").on("click", function () {
    if ($(this).hasClass("ui-popover__container--contains-active-popover")) {
        $(this).removeClass("ui-popover__container--contains-active-popover");
        $(this).find(".jindo-action-dropdown").removeClass("ui-popover ui-popover--full-height ui-popover--is-positioned-beneath ui-popover--is-active").addClass("ui-popover ui-popover--full-height");
    } else {
        $(this).addClass("ui-popover__container--contains-active-popover");
        $(this).find(".jindo-action-dropdown").removeClass("ui-popover ui-popover--full-height").addClass("ui-popover ui-popover--full-height ui-popover--is-positioned-beneath ui-popover--is-active");
        $("#all-products").find(".jindo-select-label").removeClass("bulk-actions__select-all-btn btn-slim btn next-label next-label--switch");
    }
});


var delayTimer;
function doSearch(text) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
        $.ajax({
            url: "/Admin/Product/SearchProduct?query=" + encodeURIComponent(text),
            type: 'GET',
            beforeSend: function () {
                $("#all-products tbody tr").remove();
            },
            success: function (data) {
                idSelected = [];
                $("#all-products tbody").append(data);
                //console.log(data);
            }
        });
    }, 500);

}

//Ví dụ: getUrlParameter('page') == 1
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};


// Edit product số lượng lớn
$("#bulk-button").on("click", function (e) {
    $.redirect("/admin/product/BulkEditor", { dataArr: idSelected }, "POST", "_self");
});

$("#AddFieldButton").on("click", function (e) {
    if ($(this).parent().hasClass("ui-popover__container--contains-active-popover")) {
        $(this).parent().removeClass("ui-popover__container--contains-active-popover");
        $(this).parent().find("#dropdown-field").removeClass("ui-popover ui-popover--reduced-spacing bulk-edit__popover ui-popover--is-positioned-beneath ui-popover--is-active").addClass("ui-popover ui-popover--reduced-spacing bulk-edit__popover ui-popover--is-positioned-beneath");
    } else {
        $(this).parent().addClass("ui-popover__container--contains-active-popover");
        $(this).parent().find("#dropdown-field").removeClass("ui-popover ui-popover--reduced-spacing bulk-edit__popover ui-popover--is-positioned-beneath").addClass("ui-popover ui-popover--reduced-spacing bulk-edit__popover ui-popover--is-positioned-beneath ui-popover--is-active");
        $(this).parent().find("#dropdown-field").addClass("jindo-dropdown-css");
        $(this).parent().find("#dropdown-field .ui-popover__tooltip").css("left", "275px");
        $(this).parent().find("#dropdown-field .ui-popover__content-wrapper .ui-popover__content").css({ 'max-height': "300px", width: "550px" });
    }
});

function AddField(event) {
    var field = $(event).attr("data-field");
    var group = $(event).attr("data-group");

    UpdateField(field, group, "add");
}

function RemoveField(event) {
    var field = $(event).attr("data-field");
    var group = $(event).attr("data-group");
    UpdateField(field, group, "remove");
}

function UpdateField(field, group, action) {
    $.ajax({
        url: "/Admin/Product/UpdateField",
        type: 'POST',
        data: {
            field: field,
            group: group,
            action: action
        },
        beforeSend: function () {
            //
        },
        success: function (data) {
            location.reload();
        }
    });
}

function FieldClick(event) {

    var product_id = $(event).attr("data-product-id");
    var variant_id = $(event).attr("data-variant-id");
    var field_name = $(event).attr("data-field-name");

    $('div.spreadsheet__row').find('div.spreadsheet__cell--focused').removeClass("spreadsheet__cell--focused");
    //$(event).parents().eq(2).addClass("spreadsheet__cell--focused");

    console.log(product_id + ":" + variant_id + ":" + field_name);

    $('div[data-product-id="' + product_id + '"][data-variant-id="' + variant_id + '"][data-field-name="' + field_name + '"]').addClass("spreadsheet__cell--focused");
}


// Khi back lại trang thì ko bị lưu checked
$('input:checkbox').prop('checked', false);