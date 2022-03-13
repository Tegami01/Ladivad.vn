/// <summary>
/// Admin: CreateProduct
/// </summary>
var postId = $("#ProductId").val();
var delayTimer;

function VariantCheck(data) {
    var variantName = $(data).parents().eq(2).attr("data-variant");

    ClickCheckBox("variant", variantName);
}

//$("#variant-taxable").on("click", function () {
//    ClickCheckBox("tax")
//})


//$("#variant-requires_shipping").on("click", function () {
//    ClickCheckBox("shipping");
//});


function ClickCheckBox(dataType, variantName) {
    $.ajax({
        type: "POST",
        url: "/Admin/Product/ProductCheck",
        data: {
            productId: postId,
            dataType: dataType,
            variantName: variantName
        }
    });
}


// Submit Form
function CreateProduct() {
    setTimeout(function () {
        if ($("div.validation-summary-errors ul li").length > 0) {
            $("div.jindo-error-validation").removeClass("hide");
        }
    }, 10);

    window.scrollTo(0, 0);
}


// Set ảnh chính và ảnh phụ cho sản phẩm
function SetFeaturedImage() {
    var dataArr = new Array();

    $("#jindoUpload .dz-processing").each(function (i, val) {
        dataArr.push($(val).find(".dz-image img").attr("alt"));
        return i < 1;   // Chạy 2 phát thôi
    });

    $.ajax({
        type: "POST",
        url: '/Admin/Product/SetFeaturedImage',
        data: {
            productId: postId,
            'dataArr': dataArr
        }
    });
}



// Insert Tags
$('body').on('keypress', '#tags-event-bus #tags', function (e) {
    if (e.keyCode == '13') {
        e.preventDefault();

        var tagName = $(this).val().trim();
        var tagsList = '<li class="next-token">' +
            ' <span class="next-token__label">' + $(this).val() + '</span>' +
            ' <a onclick="removeTag(this)" data-name=' + $(this).val() + ' class="next-token__remove">' +
            ' <input class="tagValue" type="hidden" value="' + $(this).val() + '">' +
            ' <span class="next-token__remove__icon">' +
            ' <svg class="next-icon next-icon--size-10 next-icon--no-nudge">' +
            ' <use xlink:href="#next-remove"></use>' +
            ' </svg>' +
            ' </span>' +
            ' </a>' +
            ' </li>';

        $.ajax({
            url: "/Admin/Product/InsertTag",
            type: "POST",
            data: {
                productId: postId,
                tagName: tagName
            },
            success: function (data) {
                if (data.success == true) {
                    $("#tags-event-bus ul.js-tag-list").append(tagsList);
                } else {
                    $("#tags-event-bus .tooltip-error").removeClass("hide");
                    $("#tags-event-bus ul.error-list li").css("z-index", "10");
                    $("#tags-event-bus ul.error-list li").html('' + tagName + ' đã tồn tại.');
                    setTimeout(function () {
                        $("#tags-event-bus .tooltip-error").addClass("hide");
                    }, 3000);
                }
            }
        }).done(function () {
            //
        });
        $(this).val('');
    }
});

// Remove TagName
function removeTag(name) {
    var tagName = $(name).attr("data-name");
    $.ajax({
        url: '/Admin/Product/RemoveTag',
        type: 'POST',
        data: {
            productId: postId,
            tagName: tagName
        },
        success: function (data) {
            if (data.success == true) {
                $(name).parent().remove();
            }
        }
    })
}


function AjaxDropDown(mainId, elementId, elementList, selectColor, ajaxUrl, method) {
    if ($(mainId).hasClass("ui-popover--is-active")) {
        $(mainId).removeClass("ui-popover--is-active");
    } else {
        $.ajax({
            url: ajaxUrl,
            type: method,
            beforeSend: function () {
                // Show listbox
                $(mainId).addClass("ui-popover--is-active");
            },
            success: function (data) {
                if (data.trim() == "") {
                    $(mainId).removeClass("ui-popover--is-active");
                }

                $(elementList).html(data);  // Đổ data ra view
                var catId = $(elementId).val();
                if ($(elementId).val() !== "") {
                    $(elementList + " li").find("a[data-id='" + catId + "']").addClass("next-list__item--is-selected").css("background", selectColor);
                } else {
                    $(elementList + " li").first().find("a").addClass("next-list__item--is-selected");
                }
            }
        }).done(function () {
            $(elementList).hover(function () {
                $(elementList + " li").first().find("a").removeClass("next-list__item--is-selected");
            });

            // Load xong data thì ẩn loading
            $(mainId + " .ui-popover__section").addClass("hide");
        });
    }
}


// Show Dropdown-List
$(".jindo-list a.btn").on("click", function (e) {
    e.stopPropagation();
    var getType = $(this).attr("data-type");

    if (getType == "category") {
        var mainId = "#main-categories-list";
        var elementList = ".load-categories-list";
        var elementId = "#CategoryId";
        var selectColor = "#afb9c2";
        var ajaxUrl = "/Admin/Product/CategoriesList/?catName=";
        var method = "GET";
    } else if (getType == "supplier") {
        var mainId = "#main-supplier-list";
        var elementList = ".load-supplier-list";
        var elementId = "#SupplierId";
        var selectColor = "#afb9c2";
        var ajaxUrl = "/Admin/Product/SupplierList/?supplierName=";
        var method = "GET";
    } else if (getType == "brand") {
        var mainId = "#main-brand-list";
        var elementList = ".load-brand-list";
        var elementId = "#BrandId";
        var selectColor = "#afb9c2";
        var ajaxUrl = "/Admin/Product/BrandList/?brandName=";
        var method = "GET";
    }

    AjaxDropDown(mainId, elementId, elementList, selectColor, ajaxUrl, method);
});


// Group List
$("#product-groups #product-group-input").on("click", function (e) {
    if ($("#main-groups-list").hasClass("ui-popover--is-active")) {
        $("#main-groups-list").removeClass("ui-popover--is-active")
    } else {
        //e.stopPropagation();
        $.ajax({
            url: "/Admin/Product/GroupList",
            type: "GET",
            beforeSend: function () {
                $("#main-groups-list").addClass("ui-popover--is-active");
            },
            success: function (data) {
                if (data == "") {
                    $("#main-groups-list").removeClass("ui-popover--is-active");
                }

                $(".load-group-list").html(data);  // Đổ data ra view
            }
        }).done(function () {
            // Load xong thì ẩn "loading"
            $("#main-groups-list .ui-popover__section").addClass("hide");

            // Đánh dấu những giá trị đã chọn
            $("#product-groups-selected ul li").each(function (i, val) {
                $("#main-groups-list ul.load-group-list li a").each(function (count, select) {
                    if ($(select).attr("data-id") == $(val).attr("data-id")) {
                        $(this).addClass("next-list__item--is-applied");
                    }
                });
            });
        });
    }
});


// Set giá trị cho HiddenInput
function SetValueToInput(event, type) {
    if (type == "supplier") {
        $("#SupplierId").val($(event).attr("data-id"));
        $("#product-supplier-input").val($(event).attr("data-value").trim());
        $("#main-supplier-list").removeClass("ui-popover--is-active");
    } else if (type == "category") {
        $("#CategoryId").val($(event).attr("data-id"));
        $("#product-categories-input").val($(event).attr("data-value").trim());
        $("#main-categories-list").removeClass("ui-popover--is-active");
    } else if (type == "brand") {
        $("#BrandId").val($(event).attr("data-id"));
        $("#product-brand-input").val($(event).html().trim());
        $("#main-brand-list").removeClass("ui-popover--is-active");
    } else if (type == "group") {               // Chọn nhóm sản phẩm
        var myvar = '<li data-id=' + $(event).attr("data-id") + '>' +
            '  <div class="next-grid next-grid--no-outside-padding next-grid--vertically-centered">' +
            '    <div class="next-grid__cell type--truncated" style="padding-right: 0">' +
            '      <a href="#" class="product-collections-list__link tooltip-wordy tooltip-top" data-id=' + $(event).attr("data-id") + '>' + $(event).find(".group-title").html().trim() + '</a>' +
            '    </div>' +
            '    <div class="next-grid__cell next-grid__cell--no-flex">' +
            '      <button type="button" onclick="RemoveGroup(this);" data-id=' + $(event).attr("data-id") + ' class="ui-button ui-button--size-small ui-button--icon-only ui-button--transparent" href="#" title="Remove \'' + $(event).find(".group-title").html().trim() + '\' khỏi danh sách">' +
            '        <i class="next-icon next-icon--10 next-icon--remove-slate-lighter"></i>' +
            '      </button>' +
            '    </div>' +
            '  </div>' +
            '</li>';

        // Nếu đã check thì bỏ check
        if ($(event).hasClass("next-list__item--is-applied")) {
            $(event).removeClass("next-list__item--is-applied");
            $('#product-groups-selected ul li[data-id=' + $(event).attr("data-id") + ']').remove();
        } else {
            // Nếu chưa có thì check
            $(event).addClass("next-list__item--is-applied");
            $("#product-groups-selected ul").append(myvar);
        }

        setValueGroupInput();
    }
}

// Set giá trị cho Group Input Hidden
function setValueGroupInput() {
    var textArr = new Array;
    var idArr = new Array;

    $("#product-groups-selected ul li").each(function (i, val) {
        //console.log($(val).find("a").html());
        textArr.push($(val).find("a").html().trim());
        idArr.push($(val).find("a").attr("data-id"));
    });;

    $("#GroupId").val(idArr.toString());
    $("#GroupSlug").val(textArr.toString());
}


// Xóa group đã chọn
function RemoveGroup(item) {
    $('#product-groups-selected ul li[data-id=' + $(item).attr("data-id") + ']').remove();
    setValueGroupInput();
}


// Chèn giá trị vào Variant Input
function doInsertVariant(event) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
        var variantName = $(event).attr("data-variant");         // x,m,l
        var variantType = $(event).attr("data-type");            // price - sku - barcode
        var variantValue = $(event).val();                       // 3000000

        if ($.isNumeric(variantValue) == false && variantType == "price") {
            variantValue = 0;
        }

        $.ajax({
            type: "POST",
            url: '/Admin/Product/AjaxEditVariant',
            data: {
                productId: postId,
                variantName: variantName,
                variantValue: variantValue,
                variantType: variantType
            },
            success: function (data) {
                if (data.success) {
                    //
                } else {
                    //console.log(data);
                }
            }
        });
    }, 300);
}



/// <summary>
/// Admin: BoxSEO
/// </summary>
var postTitle;
var isTitleEditable = false;
var isDescEditable = false;

var slug = function (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    //var from = "ứởổỡẵỷỹỳýờằữăậịẹẫồớỗễốầắộạừểọủấụửơượựýềệếđảẩãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    //var to = "uoooayyyyoauaaieaoooeoaaoaueouauuououyeeedaaaaaaaeeeeeiiiiooooouuuunc------";
    var from = "áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ·/_,:;[]{}";
    var to = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyy----------";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
};

// Đưa giá trị ra box SEO
function doTitle(event) {
    clearTimeout(delayTimer);

    delayTimer = setTimeout(function () {
        var productName = $(event).val();
        if (isTitleEditable == false) {
            $("#seo-title-tag").attr("placeholder", productName);
            $(".google__title").html(productName);
            $(".google__url span").html(slug(productName));

            $(".google-preview").removeClass("hide");
            $(".google__url").removeClass("hide");
            $("#JindoSeoDesc").addClass("hide");

            if (productName == "") {
                $(".google__description").removeClass("hide");
                $("#JindoSeoDesc").removeClass("hide");
                $(".google__url").addClass("hide");
                $(".google-preview").addClass("hide");
            }
        }
    }, 500);
}


$(document).click(function (e) {
    $('.jindo-dropdown-load').find('.ui-popover--is-active').removeClass("ui-popover--is-active");

    if ($("#ProductName").val() == postTitle) {
        $("#seo-title-tag").val("");
    }
});

$("#seo-title-tag").on("click", function (event) {
    if (isTitleEditable == false) {
        $(this).val($(this).attr("placeholder"));
        postTitle = $(this).attr("placeholder");
    }

    event.stopPropagation();
});


function doMetaTitle(event) {
    clearTimeout(delayTimer);

    delayTimer = setTimeout(function () {
        isTitleEditable = true;
        postTitle = $(event).val();
        $(".google__title").html($(event).val());

        $(".google-preview").removeClass("hide");
        $(".google__url").removeClass("hide");
        $("#JindoSeoDesc").addClass("hide");

        if (postTitle === "") {
            $(".google-preview").addClass("hide");
            $("#JindoSeoDesc").removeClass("hide");
        }
    }, 0);
}

//$(".google-preview").removeClass("hide");
//$("#JindoSeoDesc").addClass("hide");

function doSearch(text) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
        $.ajax({
            url: "/Admin/Product/CategoriesList",
            type: 'GET',
            data: {
                catName: text,
                typeQuery: "search"
            },
            beforeSend: function () {
                $("#main-categories-list").addClass("ui-popover--is-active");
            },
            success: function (data) {
                if (data.trim() == "") {
                    $("#main-categories-list").removeClass("ui-popover--is-active");
                }

                $(".load-categories-list").html(data);
                $(".load-categories-list li").first().find("a").addClass("next-list__item--is-selected");
            }
        }).done(function () {
            //if ($(".load-categories-list li").length > 0) {
            //    $("#main-categories-list").addClass("ui-popover--is-active");
            //} else {
            //    $("#main-categories-list").removeClass("ui-popover--is-active");
            //}

            $(".load-categories-list li").hover(function () {
                $(".load-categories-list li").first().find("a").removeClass("next-list__item--is-selected");
            })
        });
    }, 500); // Will do the ajax stuff after 1000 ms, or 1 s
}


/// DETELE VARIANT
// Function xóa variant
function DeleteVariant(thisId, variantName, element) {
    $.ajax({
        type: "POST",
        url: '/Admin/Product/DeleteVariantOption',
        data: {
            productId: postId,
            variantName: variantName,
            element: element
        },
        success: function (data) {
            if (data.success) {
                UpdateVariantInput(thisId);         // Làm mới lại VariantInput Hidden
            } else {
                //console.log(data);
            }
        }
    });
}

// Xóa Variant Option
$('body').on('click', 'a.remove-option', function (e) {
    var thisId = $(this).attr("id").split('-').pop();
    var variantNameId = "'[" + thisId + "].VariantName'";
    var variantName = $("input[name=" + variantNameId + "]").val();

    if ($('.options-jindo-main').length == 1) {
        return;
    }

    $('#tr-option-id-' + thisId + '').remove();

    if ($('.options-jindo-main').length <= 3) {
        $('.js-add-option').show();
    }

    DeleteVariant(thisId, variantName, "");
})

// Xóa từng phần tử
$('body').on('click', 'a.tagit-close', function (e) {
    var thisId = $(this).attr("id").split('-').pop();
    var variantNameId = "'[" + thisId + "].VariantName'";
    var variantName = $("input[name=" + variantNameId + "]").val();
    var elementValue = $(this).parent().find("span.tagit-label").html();

    $(this).parent().remove();

    // Xóa trong database
    DeleteVariant(thisId, variantName, elementValue);
});
/// END: DETELE VARIANT


// Lấy ra nhóm Variant
function GetVariantList() {
    var arr = new Array;
    var result = new Array;
    var dataArr = new Array;

    $('.jindo-variant .jindo-list-variant .variant-value[type="hidden"]').each(function (i, val) {
        var thisElement = $(this);
        arr.push(thisElement.val());
    });

    $.each(arr, function (i, val) {
        result.push(val.split(','));
    });

    result.push([""], [""], [""]);

    $.each(result[0], function (i, color) {
        $.each(result[1], function (i, size) {
            $.each(result[2], function (i, material) {
                $.each(result[3], function (i, storage) {
                    var data = ([color] + "," + [size] + "," + [material] + "," + [storage]).replace(",,", "");
                    if (data[data.length - 1] === ",")
                        data = data.slice(0, -1);

                    if (data.slice(0, 1) === ",")
                        data = data.substring(1, data.length);

                    dataArr.push(data);

                    if (dataArr[0] === "") {
                        dataArr.length = 0;
                    }
                })
            })
        })
    });

    // Xóa tất cả nội dung trong tr sau đó thêm mới lại
    $("div#jindo-variant-details table tbody tr").remove();
    $.each(dataArr, function (i, val) {
        var myvar = '<tr class="tr-variant-class" data-variant=' + val + '>' +
            '             <td class="select">' +
            '                   <div class="next-input-wrapper next-input-wrapper--inline">' +
            '                         <input type="checkbox" onclick="VariantCheck(this)" class="next-checkbox" checked="checked">' +
            '                         <span class="next-checkbox--styled">' +
            '                               <svg class="next-icon next-icon--size-10 next-icon--blue checkmark" aria-hidden="true" focusable="false">' +
            '                                    <use xlink:href="#next-checkmark"></use>' +
            '                               </svg>' +
            '                         </span>' +
            '                   </div>' +
            '             </td>' +
            '             <td data-id=' + postId + ' class="jindo-variant-title" style="width:auto">' + val.replace(/,/g, " • ") + '</td>' +
            '             <td>' +
            '                   <input type="text" onkeyup="doInsertVariant(this)" data-variant=' + val + ' data-type="price" placeholder="0" class="select-all-on-focus next-input js-money-field product-variant-input">' +
            '             </td>' +
            '             <td><input type="text" onkeyup="doInsertVariant(this)" data-variant=' + val + ' data-type="sku" class="select-all-on-focus next-input product-variant-input"></td>' +
            '             <td><input type="text" onkeyup="doInsertVariant(this)" data-variant=' + val + ' data-type="barcode" class="select-all-on-focus next-input product-variant-input"></td>' +
            '             <td><input type="hidden" data-variant=' + val + ' value=' + val + ' data-type="temp" class="variant-name-hidden"></td>' +
            '       </tr>';
        $("div#jindo-variant-details table tbody").append(myvar);
    });

    //console.log($('div#jindo-variant-details table tbody tr').length);

    // Show Variant List
    if ($('div#jindo-variant-details table tbody tr').length == 0) {
        $(".ppt").addClass("hide");
    } else {
        $(".ppt").removeClass("hide");
    }

    // Insert Array vào Database
    $.ajax({
        type: "POST",
        url: '/Admin/Product/InsertVariantDetails',
        traditional: true,
        data: {
            productId: postId,
            'dataArr': dataArr
        }
    });
}


// Thêm Option Variant mới
function addNewOption() {
    if ($('.options-jindo-main').length >= 3) {
        $('.js-add-option').hide();
    }

    var $mainDiv = $("div.jindo-variant");
    var $divLast = $mainDiv.find("tr.options-jindo-main:last");
    var $divNew = $divLast.clone();

    var suffix = $divNew.find(':input:first').attr('name').match(/\d+/);

    //
    $divNew.attr("id", 'tr-option-id-' + (parseInt(suffix) + 1) + '');

    // Sửa attr option
    var optionN = parseInt(suffix) + 1;
    $.each($divNew.find('ul.jindo-list-variant'), function (i, val) {
        $(this).removeClass('option-' + optionN + '').addClass('option-' + (parseInt(optionN) + 1) + '');
    });

    // Sửa attr của remove button
    $.each($divNew.find('a.remove-option'), function (i, val) {
        $(this).attr("id", 'delete-id-' + (parseInt(suffix) + 1) + '');
    });

    // Set lại Id của Ul
    $.each($divNew.find('ul.jindo-list-variant'), function (i, val) {
        $(this).attr("id", 'ul-id-' + (parseInt(suffix) + 1) + '');
    });

    // Set lại name cho Input
    $.each($divNew.find(':input'), function (i, val) {
        // Replaced Name
        var oldN = $(this).attr('name');
        var newN = oldN.replace('[' + suffix + ']', '[' + (parseInt(suffix) + 1) + ']');
        $(this).attr('name', newN);
    });
    $divLast.after($divNew);

    // Set IsEmpty cho VariantValue
    //$divNew.find(".variant-name").val("");
    $divNew.find(".variant-value").val("");
    $divNew.find(".tagit-choice").remove();


    ////////////////////////////////////////////
    // VARIANT NAME
    var variantTemp = [];
    var variantName = ["Kích thước", "Màu sắc", "Chất liệu", "Kiểu dáng", "Dung lượng"];
    $(".options-jindo-main").each(function (index) {
        //console.log($(this).find(".variant-name").val());
        variantTemp.push($(this).find(".variant-name").val());
    });

    // Set Variant Name
    $.each(variantName, function (key, value) {
        $.each(variantTemp, function (key, value) {
            removeA(variantName, value);
        })
    });

    //var rand = variantName[Math.floor(Math.random() * variantName.length)];

    $divNew.find(".variant-name").val(variantName[0]);
}


function removeA(arr) { var what, a = arguments, L = a.length, ax; while (L > 1 && arr.length) { what = a[--L]; while ((ax = arr.indexOf(what)) !== -1) { arr.splice(ax, 1) } } return arr }

//function SubmitVariant(form) { $.validator.unobtrusive.parse(form); if ($(form).valid()) { $.ajax({ type: "POST", url: form.action, data: $(form).serialize(), success: function (data) { if (data.success) { } } }) } return false }

function SubmitAltImage(form) {
    $.validator.unobtrusive.parse(form);
    if ($(form).valid()) {
        $.ajax({
            type: "POST",
            url: form.action,
            data: $(form).serialize(),
            success: function (data) {
                if (data.success) {
                    $("#vnnsoft-modal").hide()
                }
            }
        })
    } return false
}



// không cho enter ở Input Variant
$('body').on('keypress', 'tr.options-jindo-main .variant-name', function (e) {
    if (e.keyCode == '13') {
        e.preventDefault();
    }
});

// không cho enter ở Input chọn danh mục
$('body').on('keypress', '.jindo-dropdown-load .next-input', function (e) {
    if (e.keyCode == '13') {
        e.preventDefault();
    }
});


// Insert Variant
$('body').on('keypress', '.tagit-new input.ui-widget-content', function (e) {
    if (e.keyCode == '13') {
        e.preventDefault();

        var thisId = parseInt($(this).attr("name").match(/\d+/));
        var variantValue = "'[" + thisId + "].VariantValue'";
        var variantName = "'[" + thisId + "].VariantName'";
        var text = "'[" + thisId + "].VariantText'";

        // Nếu ko nhập thì thì lượn thoai
        if ($("input[name=" + text + "]").val().trim() == "") {
            return;
        }

        // Insert Variant vào Database
        var getVariantName = $("input[name=" + variantName + "]").val().trim();

        $.ajax({
            type: "POST",
            url: '/Admin/Product/InsertVariant',
            data: { productId: postId, variantName: getVariantName, variantValue: $("input[name=" + text + "]").val() },
            success: function (data) {
                if (data.success) {
                    var liTag = "<li class=\"tagit-choice ui-widget-content ui-state-default ui-corner-all tagit-choice-editable\">" +
                        "<span class=\"tagit-label\">" + $("input[name=" + text + "]").val() + "</span><a id=\"a-" + thisId + "\" class=\"tagit-close\"><span class=\"text-icon\">×</span>" +
                        "<span class=\"ui-icon ui-icon-close\"></span></a><input type=\"hidden\" name class=\"tagit-hidden-field\" value=\"S\">" +
                        "</li>";

                    $("ul#ul-id-" + thisId + "").append(liTag);

                    // Clear text input
                    $("input[name=" + text + "]").val("");

                    var inputClone = $("ul#ul-id-" + thisId + " .tagit-new").clone();
                    $("ul#ul-id-" + thisId + " .tagit-new").remove();
                    $("ul#ul-id-" + thisId + "").append(inputClone);

                    $("ul#ul-id-" + thisId + " .tagit-new input").focus();

                    UpdateVariantInput(thisId);
                } else {
                    showTooltipError(thisId);
                    return;
                }
            }
        });
    }
});


// Function hiển thị Tooltip thông báo biến thể đã tồn tại
function showTooltipError(thisId) {
    var thisElement = $("tr#tr-option-id-" + thisId + " div.tooltip-error");
    thisElement.removeClass("hide");
    setTimeout(function () {
        thisElement.addClass("hide")
    }, 3000);
}


function UpdateVariantInput(thisId) {
    var variantArr = [];
    var variantValue = "'[" + thisId + "].VariantValue'";

    $("ul#ul-id-" + thisId + " li").each(function (index) {
        variantArr.push($(this).find("span").html());
    });
    variantArr = variantArr.slice(0, -1);

    // Đưa dữ liệu ra input hiden - VariantValue
    $("input[name=" + variantValue + "]").val(variantArr.toString(), function () {
        console.log("Đưa dữ liệu ra input hiden");
    });

    GetVariantList();
}


function formatNumber(nStr, decSeperate, groupSeperate) {
    nStr += '';
    x = nStr.split(decSeperate);
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + groupSeperate + '$2');
    }
    return x1 + x2;
}


$("button.ui-button--link").on("click", function () {
    if ($(this).html() == "Add variant" || $(this).html() == "Thêm phiên bản") {
        $(this).addClass("hide");
        $(this).next(".ui-button--link").removeClass("hide");
        $(".jindo-variant").removeClass("hide");


    } else if ($(this).html() == "Cancel" || $(this).html() == "Thu gọn") {
        $(this).addClass("hide");
        $(this).parent().find("button").first().removeClass("hide");
        $(".jindo-variant").addClass("hide");
    } else if ($(this).html() == "Edit website SEO" || $(this).html() == "Chỉnh sửa SEO") {
        $(".jindo-seo-preview").removeClass("hide");
        //$(".google-preview").removeClass("hide");
        //$("#JindoSeoDesc").addClass("hide");
        $(this).addClass("hide");
    }
});


function EditAltImage(data) {
    var imageId = $(data).parent().parent().attr('id');
    ShowModal("/Admin/Product/SetImageAlt/?imageId=", imageId);
}

function ShowImage(data) {
    var imageId = $(data).parent().parent().attr('id');
    ShowModal("/Admin/Product/ImageView/?imageId=", imageId);
}

function ShowModal(url, imageId) {
    $.ajax({
        url: url + imageId.substring(3),
        type: "GET",
        success: function (data) {
            $('#vnnsoft-modal').html(data);   // Đưa data vào
            $("#vnnsoft-modal").show();       // Show data

            $(".close-modal").on("click", function () {
                $("#vnnsoft-modal").hide();
            });
        }
    });
}


// Upload
$('#imgSubmit').on('click', function (e) {
    $('div#jindoUpload').click();
});

Dropzone.autoDiscover = false;
var myDropzone = new Dropzone("div#jindoUpload", {
    maxFiles: 12,
    parallelUploads: 12,        // Upload đồng thời
    acceptedFiles: 'image/*',
    url: '/admin/product/UploadAlbum/' + postId,
    previewTemplate: document.querySelector('#template-preview').innerHTML,
    queuecomplete: function () {
        ImageSortable();            // Upload xong tất cả mới cho phép sắp xếp
        SetFeaturedImage();         // Upload xong thì cập nhập FeaturedImage
    },
    accept: function (file, done) {
        if (file.type != "image/jpeg" && file.type != "image/png") {
            alert("Lỗi! Không phải ảnh, không thể upload.");
            this.removeFileNoSql(file);
        }
        else {
            done();
        }
    },
    //addRemoveLinks: false
});

myDropzone.on("addedfile", function (file) {
    // Check trùng file upload
    if (this.files.length) {
        var _i, _len;
        for (_i = 0, _len = this.files.length; _i < _len - 1; _i++) // -1 to exclude current file
        {
            if (this.files[_i].name === file.name && this.files[_i].size === file.size && this.files[_i].lastModifiedDate.toString() === file.lastModifiedDate.toString()) {
                this.removeFileNoSql(file); // File tồn tại, không add nữa, chỉ remove trên giao diện, không remove trong database
            }
        }
    }
});

myDropzone.on("success", function (file, response) {
    $(file.previewElement).attr("id", "id_" + response);
    resizeFirstImage();
});

myDropzone.on("uploadprogress", function (file) {
    //
});


function resizeFirstImage() {
    $("div#jindoUpload").css("min-height", "290px");
    $(".dz-processing").first().css("width", "38.3%").css("height", "250px").css("float", "left");

    //$(".dz-processing").first().css("width", "38.3%").css("height", "250px");
    //$(".dz-processing:not(:first)").css("float","left");
}

// Xóa ảnh
myDropzone.on("removedfile", function (file) {
    $.ajax({
        type: "POST",
        url: '/Admin/Product/DeleteImage',
        data: { productId: postId, fileName: file.name, fileSize: file.size },
        success: function (data) {
            if (data.success) {
                ClearDivStyle();
                resizeFirstImage();

                //console.log($("div.dz-processing").length);
                if ($("div#jindoUpload .dz-processing").length == 0) {
                    $("div#jindoUpload").attr("style", "");
                }
                if ($("#jindoUpload .dz-processing").length < 2) {
                    SetFeaturedImage();
                }
            } else {
                //console.log(data.message);
            }
        }
    });
});

// Clear Style của Div
function ClearDivStyle() {
    $("div.dz-preview").each(function (index) {
        $("div.dz-preview").attr("style", "");
    });
}

// Sắp xếp
function ImageSortable() {
    $("#jindoUpload").sortable({
        items: '.dz-preview',
        placeholder: "highlight",
        cursor: 'move',
        opacity: 0.5,
        containment: "parent",
        distance: 20,
        tolerance: 'pointer',
        update: function (e, ui) {
            var ids = $("div#jindoUpload").sortable("serialize");
            var url = "/Admin/Product/ReorderImages";

            ClearDivStyle();            // Clear tất cả style của div
            resizeFirstImage();         // Zoom ảnh đầu tiên

            $.post(url, ids, function (data) {
                SetFeaturedImage();     // Upload xong thì cập nhập FeaturedImage
            });
        },
        start: function (event, ui) {
            //
        }
    });
}


// Unsaved product
// The form's dirty flag
var isFormDirty = false;

// Reset flag on submit
$("form").submit(function (event) {
    isFormDirty = false;
});

// Set flag on changes
$(":input").change(function () {
    isFormDirty = true;
});

if ($(".trumbowyg-editor").html() !== "") {
    isFormDirty = true;
}

// Show message when leaving page
$(window).bind('beforeunload', function (e) {
    if (isFormDirty) {
        if (confirm("Discard changes?")) {
            return true; // Leave page
        } else {
            return false; // Stay on page
        }
    }
});

