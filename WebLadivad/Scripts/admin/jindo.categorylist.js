// Array chứa danh sách sản phẩm
var idSelected = new Array();
var arrFilter = new Array;
var query = getUrlParameter('query');

$("#category-search").val(queryResult(query));

function selectFilter(event) {
    // Ẩn tất cả lựa chọn trước khi chọn lại
    $(".filter-builder .jindo-option-select").each(function (i, val) {
        if ($(this).hasClass("hide") == false) {
            $(this).addClass("hide");
        }
    })

    switch ($(event).val()) {
        case $(event).val():
            $("div[bind-show=" + $(event).val() + "]").removeClass("hide");
            break;
        default:
            break;
    }
}

function selectFilterValue(event) {
    switch ($(event).attr("data-bind")) {
        case $(event).attr("data-bind"):
            arrFilter[$(event).attr("data-bind")] = $(event).val();
            break;
        default:
    }

    SearchListResult();
    dropdownFilter(null, true);
}


// Load phần tử đã chọn và hiển thị
function loadFilterList() {
    $("#jindo-filter-list ul.ui-tags li").remove();
    for (var key in arrFilter) {
        var key_display = "";
        var value_display = "";

        switch (key) {
            case "published_status":
                key_display = "Trạng thái sản phẩm: ";
                break;
            case "product_type":
                key_display = "Danh mục sản phẩm: ";
                break;
            default:
                key_display = key;
                break;
        }

        switch (arrFilter[key]) {
            case "true":
                value_display = "hiện";
                break;
            case "false":
                value_display = "ẩn";
                break;
            default:
                value_display = arrFilter[key];
                break;
        }

        var myvar = '<li class="ui-tag">' +
            '             <span class="ui-tag__label">' + key_display + value_display + '</span>' +
            '             <button data-filter-key=' + key + ' type="button" name="button" aria-label="Remove tag" class="ui-tag__remove-button" onclick="removeFilter(this)"><svg style="margin-top:-3px" aria-hidden="true" focusable="false" class="next-icon next-icon--color-slate-lighter next-icon--size-12"> <use xlink:href="#next-remove"></use> </svg></button>' +
            '        </li>';

        $("#jindo-filter-list ul.ui-tags").append(myvar);
    }

    if ($("#jindo-filter-list ul.ui-tags").length > 0) {
        $("#jindo-filter-list").removeClass("hide");
    }
}

function removeFilter(event) {
    delete arrFilter[$(event).attr("data-filter-key")];
    SearchListResult();
}

function replaceUrl() {
    var url = "";

    if (typeof query !== "undefined") {
        url = "query=" + query + "&";
    } else {
        url = "query=&";
    }

    for (var key in arrFilter) {
        url = url + key + "=" + arrFilter[key] + "&";
    }

    url = url.substring(0, url.length - 1);

    window.history.pushState("Tìm kiếm", "query", "/admin/product?" + url);

    return "?" + url;
}


function SearchListResult() {
    $("#jindo-data-results").load("/Admin/Product" + replaceUrl() + " #data-results");

    // Load lại danh sách hiển thị Filter
    loadFilterList();

    if (typeof query === "undefined") {
        query = "";
    }

    // Hiện nút lưu tìm kiếm
    if (Object.keys(arrFilter).length > 0 || query.length > 0) {
        $("#saved-search-actions-next button").removeClass("hide");
    } else {
        $("#saved-search-actions-next button").addClass("hide");
    }


}


function queryResult(text) {

    if (typeof text !== "undefined") {
        text = text.replace(/\+/g, " ");
    }

    return text;
}

var delayTimer;
function doSearch(text, type) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {

        //$.redirect('product', { 'query': text }, "GET", "_self");
        query = text.replace(/\ /g, "+");

        SearchListResult(type);

    }, 1000);

}


$(document).mouseup(function (e) {
    var container = new Array();
    container.push($('#drop-down-filter'));

    $.each(container, function (key, value) {
        if (!$(value).is(e.target) // if the target of the click isn't the container...
            && $(value).has(e.target).length === 0) // ... nor a descendant of the container
        {
            $(value).removeClass("ui-popover__container--contains-active-popover");
            $(value).parent().find("#jindo-show-filter").removeClass("ui-popover--is-active");
        }
    });
});


function dropdownFilter(event, close) {
    if (typeof close === "undefined")
        close = false

    if (close == false) {
        if ($(event).parent().hasClass("ui-popover__container--contains-active-popover") == false)
            $(event).parent().addClass("ui-popover__container--contains-active-popover");
        else
            $(event).parent().removeClass("ui-popover__container--contains-active-popover");
        if ($("#jindo-show-filter").hasClass("ui-popover--is-active") == false)
            $("#jindo-show-filter").addClass("ui-popover--is-active");
        else
            $("#jindo-show-filter").removeClass("ui-popover--is-active");
    } else {
        $("#drop-down-filter").removeClass("ui-popover__container--contains-active-popover");
        $("#jindo-show-filter").removeClass("ui-popover--is-active");
    }

}




function saveSearch() {

}

function SelectItem(check) {
    if ($(check).attr("checked") == "checked") {
        $(check).attr("checked", false);
        $(check).parents().eq(2).removeClass("selected");
        $(check).parent().find(".next-checkbox--styled").css("border-color", "#c4cdd5");
        $(check).parent().find(".next-checkbox--styled .checkmark").css("-webkit-transform", "scale(0)");
    } else {
        $(check).attr("checked", true);
        $(check).parents().eq(2).addClass("selected");
        $(check).parent().find(".next-checkbox--styled").css("border-color", "#5c6ac4");
        $(check).parent().find(".next-checkbox--styled .checkmark").css("-webkit-transform", "scale(1)");
    }

    idSelected = [];
    $("#all-products tbody tr").each(function (i, val) {
        if ($(val).find(".product-check").attr("checked") == "checked") {
            idSelected.push($(val).find(".product-check").val());
        }
    });

    HeaderSelectBar(idSelected.length);
    ProductSelected(idSelected.length);
}


function ProductSelected(length) {
    var countRows = $("#all-products tbody tr").length;
    if (length > 0 && length < countRows) { // Nếu chọn nhưng không chọn hết
        $(".next-checkbox--styled .jindo-next-icon.indeterminate").css("-webkit-transform", "scale(1)");
        $(".next-checkbox--styled .jindo-next-icon.checkmark").css("-webkit-transform", "scale(0)");
    } else if (length == 0) { // Nếu không chọn sản phẩm nào
        $(".next-checkbox--styled .jindo-next-icon.indeterminate").css("-webkit-transform", "scale(0)");
        $(".next-checkbox--styled .jindo-next-icon.checkmark").css("-webkit-transform", "scale(0)");
    } else if (length == countRows) { // Nếu chọn hết
        $(".next-checkbox--styled .jindo-next-icon.indeterminate").css("-webkit-transform", "scale(0)");
        $(".next-checkbox--styled .jindo-next-icon.checkmark").css("-webkit-transform", "scale(1)");
    }
}

function bulkActionChecked(event) {
    if (idSelected.length == 0 || idSelected.length < $("#all-products tbody tr").length) {
        idSelected = []; // Reset lại danh sách sản phẩm đã chọn
        $("#all-products tbody tr").each(function (i, val) {
            $(this).find("input").attr("checked", "checked").css("border", "#1c2260");
            $(this).addClass("selected");
            $(this).find(".next-checkbox--styled .checkmark").css("-webkit-transform", "scale(1)");

            // Lấy ra những sản phẩm đã chọn
            if ($(val).find(".product-check").attr("checked") == "checked") {
                idSelected.push($(val).find(".product-check").val());
            }
        });
        $(".next-checkbox--styled").css("border-color", "#5c6ac4");
        $(".next-checkbox--styled .jindo-next-icon.checkmark").css("-webkit-transform", "scale(1)");
        $(".next-checkbox--styled .jindo-next-icon.indeterminate").css("-webkit-transform", "scale(0)");
    } else if (idSelected.length == $("#all-products tbody tr").length) {
        $("#all-products tbody tr").each(function (i, val) {
            $(this).find("input").attr('checked', false).css("border", "#c4cdd5");
            $(this).removeClass("selected");
            $(this).find(".next-checkbox--styled .checkmark").css("-webkit-transform", "scale(0)");
        });
        idSelected = [];

        $(".next-checkbox--styled").css("border-color", "#c4cdd5");
        $(".next-checkbox--styled .jindo-next-icon.checkmark").css("-webkit-transform", "scale(0)");
        $(".next-checkbox--styled .jindo-next-icon.indeterminate").css("-webkit-transform", "scale(0)");
    }

    HeaderSelectBar(idSelected.length);
}

function HeaderSelectBar(length) {
    if (length > 0) {
        $("#count-category").html(length);        // Count số lượng sản phẩm đã chọn
        $(".jindo-select-all").addClass("bulk-actions__select-all--has-selected-items");
        $(".tooltip-container").addClass("hide");
        $(".bulk-actions").addClass("bulk-actions--is-visible");
        $(".jindo-select-label").removeClass("bulk-actions__select-all-btn btn-slim btn next-label next-label--switch");
        $(".bulk-select-all p").addClass("hide");

        if (length == $("#all-products tbody tr").length) {
            $(".bulk-select-all p").removeClass("hide");
        }
    } else {
        $(".jindo-select-all").removeClass("bulk-actions__select-all--has-selected-items");
        $(".tooltip-container").removeClass("hide");
        $(".bulk-actions").removeClass("bulk-actions--is-visible");
        $(".jindo-select-label").addClass("bulk-actions__select-all-btn btn-slim btn next-label next-label--switch");

        // Nếu không chọn sản phẩm nào thì border về màu mặc định
        $("#all-products thead tr th .next-checkbox--styled").css("border-color", "#c4cdd5");
    }
}



function actionClick(event) {
    if ($(event).hasClass("ui-popover__container--contains-active-popover")) {
        $(event).removeClass("ui-popover__container--contains-active-popover");
        $(event).find(".jindo-action-dropdown").removeClass("ui-popover ui-popover--full-height ui-popover--is-positioned-beneath ui-popover--is-active").addClass("ui-popover ui-popover--full-height");
    } else {
        $(event).addClass("ui-popover__container--contains-active-popover");
        $(event).find(".jindo-action-dropdown").removeClass("ui-popover ui-popover--full-height").addClass("ui-popover ui-popover--full-height ui-popover--is-positioned-beneath ui-popover--is-active");
        $("#all-products").find(".jindo-select-label").removeClass("bulk-actions__select-all-btn btn-slim btn next-label next-label--switch");
    }
}


// Edit product số lượng lớn
function bulkEdit() {
    $.redirect("/admin/product/BulkEditor", { dataArr: idSelected }, "POST", "_self");
}


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

function CurrentInput(event) {
    this.product_id = $(event).attr("data-product-id");
    this.variant_id = $(event).attr("data-variant-id");
    this.field_name = $(event).attr("data-field-name");
    this.field_value = $(event).val();
    return this;
}


var delayTimer;
$(".jindo-bulk-input").keyup(function () {
    var thisInput = CurrentInput(this);

    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
        $.ajax({
            type: "POST",
            url: "/Admin/Product/UpdateCurrentInput",
            data: {
                productId: thisInput.product_id,
                variantId: thisInput.variant_id,
                fieldName: thisInput.field_name,
                fieldValue: thisInput.field_value
            },
            success: function (data) {
                //
            }
        });
    }, 350);
});

$(".jindo-bulk-input").on("click", function (e) {
    var thisInput = CurrentInput(this);

    $('div.spreadsheet__row').find('div.spreadsheet__cell--focused').removeClass("spreadsheet__cell--focused spreadsheet__cell--visually-focused");
    $('div[data-product-id="' + thisInput.product_id + '"][data-variant-id="' + thisInput.variant_id + '"][data-field-name="' + thisInput.field_name + '"]').addClass("spreadsheet__cell--focused spreadsheet__cell--visually-focused");
    //$('div[data-product-id="' + product_id + '"][data-variant-id="' + variant_id + '"][data-field-name="' + field_name + '"]').addClass("spreadsheet__cell--focused");
})


$("#bulk-actions__select-all").on("mouseenter", function () {
    $(".bulk-actions__select-all-tooltip").addClass("is-active");
}).on('mouseleave', function () {
    $(".bulk-actions__select-all-tooltip").removeClass("is-active");
});





// Khi back lại trang thì ko bị lưu checked
$('input:checkbox').prop('checked', false);