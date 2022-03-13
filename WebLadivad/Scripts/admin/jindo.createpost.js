/// <summary>
/// Admin: CreatePost
/// </summary>
var productId = $("#ProductId").val();
var delayTimer;

function VariantCheck(data) {
    var variantName = $(data).parents().eq(2).attr("data-variant");

    ClickCheckBox("variant", variantName);
}

//$("#variant-taxable").on("click", function () {
//    ClickCheckBox("tax");
//});


//$("#variant-requires_shipping").on("click", function () {
//    ClickCheckBox("shipping");
//});


function ClickCheckBox(dataType, variantName) {
    $.ajax({
        type: "POST",
        url: "/Admin/Product/ProductCheck",
        data: {
            productId: productId,
            dataType: dataType,
            variantName: variantName
        }
    });
}


function ProductCatFeature() {
    ShowModal("/admin/collections/feature");
}


// Submit Form
function CreatePost() {
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
        //console.log($(val).find(".dz-image img").attr("alt"));
        dataArr.push($(val).find(".dz-image img").attr("alt"));
        return i < 1;   // Chạy 2 phát thôi
    });

    $.ajax({
        type: "POST",
        url: '/Admin/Product/SetFeaturedImage',
        data: {
            productId: productId,
            'dataArr': dataArr
        }
    });
}


function InventoryActive() {
    $(".kiotviet-amount-check").removeClass("hide");

    // kiotviet-amount-check
    if ($("#kiotviet-amount-check").attr("checked") == "checked") {
        $(".kiotviet-product-id").addClass("hide");
    } else {
        $(".kiotviet-product-id").removeClass("hide");
    }
}

function InventoryNotActive() {
    $(".kiotviet-amount-check").addClass("hide");

    $(".kiotviet-product-id").addClass("hide");
    $("#Amount").val("0");

    //$("#kiotviet-amount-check").prop('checked', false);
}


$('#InventoryManagement').change(function () {
    var optionVal = $('#InventoryManagement').val();

    if (optionVal == "True") {
        InventoryActive();
    } else {
        InventoryNotActive();
    }

    $("#kiotviet-amount-check").click(function () {
        $(".soluong-tonkho").prop('readonly', true);
    });
});



$(document).on('change', '.kiotviet-brand-select', function () {
    var brandId = $(this).val();
    var detailId = $(this).attr("data-detail-id");

    $.ajax({
        type: "POST",
        url: '/Admin/Order/SetKiotVietBrand',
        ContentType: 'application/json',
        data: {
            detailId: detailId,
            kiotvietBrandId: brandId
        },
        success: function (data) {
        }
    }).done(function () {
        //
    });
});


$("#KiotVietProductId").change(function () {
    var productId = $(this).val();

    $.ajax({
        type: "POST",
        url: '/Admin/Product/CheckKiotVietProduct',
        ContentType: 'application/json',
        data: {
            productId: productId
        },
        success: function (data) {
            $("#kiotviet-product-label").html(data.message);
        }
    }).done(function () {
        //
    });
});



//$('#kiotviet-amount-check').click(function () {
//    var amountCurrent = $("#Amount").val();

//    if ($(this).is(":checked")) {
//        //$("#Amount").attr('readonly', true);
//        //amountCurrent = $("#Amount").val();
//        //$("#Amount").val("0");

//        $(".soluong-tonkho").addClass("hide");
//        $(".kiotviet-product-id").removeClass("hide");
//        $("#Amount").val("0");
//    } else {
//        //$("#Amount").attr('readonly', false);
//        //$("#Amount").val(amountCurrent);

//        $(".soluong-tonkho").removeClass("hide");
//        $(".kiotviet-product-id").addClass("hide");
//        $("#Amount").val(amountCurrent);
//    }

//});


function trim(str) {
    var stringStarted = false;
    var newString = "";

    for (var i in str) {
        if (!stringStarted && str[i] == " ") {
            continue;
        }
        else if (!stringStarted) {
            stringStarted = true;
        }
        newString += str[i];
    }

    return newString;
}


// Insert Tags
$('body').on('keypress', '#tags-event-bus #tags', function (e) {
    if (e.keyCode == '13') {
        e.preventDefault();

        
        //var tagName = $(this).val().trim();

        var url;
        var tagName = trim($(this).val());
        var dataForId = $(this).attr("data-for-id");
        var insertFor = $(this).attr("data-tag-for");
        var useAjax = false;


        console.log("sssssssssssssssssss");


        var tagsList = '<li class="next-token">' +
            ' <span class="next-token__label">' + tagName + '</span>' +
            ' <a onclick="removeTag(this)" data-for-id="' + dataForId + '" data-tag-for="' + insertFor + '" data-name="' + tagName + '" class="next-token__remove">' +
            ' <input class="tagValue" type="hidden" value="' + tagName + '">' +
            ' <span class="next-token__remove__icon">' +
            ' <svg class="next-icon next-icon--size-10 next-icon--no-nudge">' +
            ' <use xlink:href="#next-remove"></use>' +
            ' </svg>' +
            ' </span>' +
            ' </a>' +
            ' </li>';

        switch (insertFor) {
            case "product":
                url = "/Admin/Product/InsertTag";
                useAjax = true;
                break;
            case "news":
                if (dataForId == "") {
                    var newsTags = new Array();
                    $("#tags-event-bus ul.js-tag-list").append(tagsList);
                    $("ul.js-tag-list li.next-token").each(function (index, value) {
                        newsTags.push($(value).find("span").html());
                    });
                    $("#MetaKeyword").val(newsTags.toString());
                    useAjax = false;
                } else {
                    url = "/Admin/News/InsertTag";
                    useAjax = true;
                }
                break;
            default:
        }


        if (useAjax == true) {
            $.ajax({
                url: url,
                type: "POST",
                data: {
                    dataId: dataForId,
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
        }


        $(this).val('');
    }
});

// Remove TagName
function removeTag(name) {
    var tagName = $(name).attr("data-name");

    var url;
    var dataForId = $(name).attr("data-for-id");
    var removeFor = $(name).attr("data-tag-for");
    var useAjax = false;


    switch (removeFor) {
        case "product":
            url = '/Admin/Product/RemoveTag';
            useAjax = true;
            break;
        case "news":
            url = '/Admin/News/RemoveTag';
            if (dataForId == "") {
                useAjax = false
            } else {
                useAjax = true;
            }
            break;
        default:
    }

    console.log(url);
    console.log(dataForId);
    console.log(removeFor);
    console.log(useAjax);
    console.log(tagName);

    if (useAjax == true) {
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                dataId: dataForId,
                tagName: tagName
            },
            success: function (data) {
                if (data.success == true) {
                    $(name).parent().remove();
                }
            }
        });
    } else {
        $(name).parent().remove();
        var newsTags = new Array();
        $("ul.js-tag-list li.next-token").each(function (index, value) {
            newsTags.push($(value).find("span").html());
        });
        $("#MetaKeyword").val(newsTags.toString());
    }
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
        mainId = "#main-categories-list";
        elementList = ".load-categories-list";
        elementId = "#CategoryId";
        selectColor = "#afb9c2";
        ajaxUrl = "/Admin/Product/CategoriesList/?catName=";
        method = "GET";
    } else if (getType == "supplier") {
        mainId = "#main-supplier-list";
        elementList = ".load-supplier-list";
        elementId = "#SupplierId";
        selectColor = "#afb9c2";
        ajaxUrl = "/Admin/Product/SupplierList/?supplierName=";
        method = "GET";
    } else if (getType == "brand") {
        mainId = "#main-brand-list";
        elementList = ".load-brand-list";
        elementId = "#BrandId";
        selectColor = "#afb9c2";
        ajaxUrl = "/Admin/Product/BrandList/?brandName=";
        method = "GET";
    } else if (getType == "collection") {
        mainId = "#main-collection-list";
        elementList = ".load-collection-list";
        elementId = "#CollectionId";
        selectColor = "#afb9c2";
        ajaxUrl = "/Admin/Product/CollectionList/?name=";
        method = "GET";
    }

    AjaxDropDown(mainId, elementId, elementList, selectColor, ajaxUrl, method);
});


// Group List
$("#product-groups #product-group-input").on("click", function (e) {
    if ($("#main-groups-list").hasClass("ui-popover--is-active")) {
        $("#main-groups-list").removeClass("ui-popover--is-active");
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
    } else if (type == "collection") {
        $("#CollectionId").val($(event).attr("data-id"));
        $("#product-collection-input").val($(event).attr("data-value").trim());
        $("#main-collection-list").removeClass("ui-popover--is-active");
    }
    else if (type == "group") {               // Chọn nhóm sản phẩm
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
    });

    $("#GroupId").val(idArr.toString());
    $("#GroupSlug").val(SlugGenerate(textArr.toString()));

    //console.log(bodauTiengViet(textArr.toString()));
}


function SlugGenerate(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str.replace(/ /g, "-");
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
                productId: productId,
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
var isSlugEditable = false;

// Đưa giá trị ra box SEO
function doTitle(event) {
    clearTimeout(delayTimer);

    delayTimer = setTimeout(function () {
        var productTitle = $(event).val();
        if (isTitleEditable == false) {
            // SET VALUE
            $("#seo-title-tag").attr("placeholder", productTitle);
            $("#product-slug").attr("placeholder", slug(productTitle));
            $("#product-slug").val(slug(productTitle));
            $(".google__title").html(productTitle);
            $(".google__url span").html(slug(productTitle));


            // Hiện Preview và ẩn mô tả ban đầu
            $(".google-preview").removeClass("hide");
            $(".google__url").removeClass("hide");
            $("#seo-box-desc").addClass("hide");

            // Nếu xóa hết tiêu đề đi
            if (productTitle == "") {
                $(".google__description").removeClass("hide");
                $("#seo-box-desc").removeClass("hide");
                $(".google__url").addClass("hide");
                $(".google-preview").addClass("hide");
            }
        }
    }, 500);
}

$(document).click(function (e) {
    $('.jindo-dropdown-load').find('.ui-popover--is-active').removeClass("ui-popover--is-active");

    if ($("#PostName").val() == postTitle && isTitleEditable == false) {
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

$("#seo-description-tag").keyup(function () {
    // Đếm số ký tự đã viết
    $(this).parent().find("span.type--subdued span").html($(this).val().length);

    // Nếu class google-preview không ẩn thì mới hiện description
    if ($(".google-preview").hasClass("hide") == false) {
        $(".google__description").html($(this).val());
    }
});


$("#seo-title-tag").keyup(function () {
    $(this).parent().find("span.type--subdued span").html($(this).val().length);

    isTitleEditable = true;
    postTitle = $(this).val();
    $(".google__title").html($(this).val());
    $(".google-preview").removeClass("hide");
    $(".google__url").removeClass("hide");
    $(".google__url span").html(slug($(this).val()));

    $("#seo-box-desc").addClass("hide");
    $("#product-slug").attr("placeholder", slug(postTitle));
    $("#product-slug").val(slug(postTitle));

    if (postTitle === "") {
        $(".google-preview").addClass("hide");
        $("#seo-box-desc").removeClass("hide");
        isTitleEditable = false;
    }
});

//$(".google-preview").removeClass("hide");
//$("#JindoSeoDesc").addClass("hide");

function doSearchCategories(text) {
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
            });
        });
    }, 500); // Will do the ajax stuff after 1000 ms, or 1 s
}


/// DETELE VARIANT
// Function xóa variant (xóa từng phần tử và group)
function DeleteVariant(thisId, variantName, element) {
    $.ajax({
        type: "POST",
        url: '/Admin/Product/DeleteVariant',
        data: {
            productId: productId,
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

// Xóa Variant Option (xóa group)
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
});

// Xóa từng phần tử
$('body').on('click', 'a.variant-tagit-close', function (e) {
    var thisId = $(this).attr("id").split('-').pop();
    var variantNameId = "'[" + thisId + "].VariantName'";
    var variantName = $("input[name=" + variantNameId + "]").val();
    var elementValue = $(this).parent().find("span.tagit-label>a").html();

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
    var idArr = new Array;

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
                });
            });
        });
    });


    if ($("#VariantStatus").val() == "True") {
        // Xóa tất cả nội dung trong tr sau đó thêm mới lại
        $("div#jindo-variant-details table tbody tr").remove();
        $.each(dataArr, function (i, val) {

            console.log(val);
            var dataVariant = "data-variant=" + "'" + val + "'";

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
                '             <td data-id=' + productId + ' class="jindo-variant-title" style="width:auto">' + val.replace(/,/g, " • ") + '</td>' +
                '             <td>' +
                '                   <input type="text" onkeyup="doInsertVariant(this)"' + dataVariant + ' data-type="price" placeholder="0" class="select-all-on-focus next-input js-money-field product-variant-input">' +
                '             </td>' +
                '             <td><input type="text" onkeyup="doInsertVariant(this)"' + dataVariant + ' data-type="sku" class="select-all-on-focus next-input product-variant-input"></td>' +
                '             <td><input type="text" onkeyup="doInsertVariant(this)"' + dataVariant + ' data-type="barcode" class="select-all-on-focus next-input product-variant-input"></td>' +
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
                productId: productId,
                'dataArr': dataArr
            }
        });
    }


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
    var variantName = ["Kích thước", "Cân nặng", "Số lượng", "Kiểu dáng", "Dung lượng"];
    $(".options-jindo-main").each(function (index) {
        //console.log($(this).find(".variant-name").val());
        variantTemp.push($(this).find(".variant-name").val());
    });

    // Set Variant Name
    $.each(variantName, function (key, value) {
        $.each(variantTemp, function (key, value) {
            removeA(variantName, value);
        });
    });

    //var rand = variantName[Math.floor(Math.random() * variantName.length)];

    $divNew.find(".variant-name").val(variantName[0]);
}


function removeA(arr) { var what, a = arguments, L = a.length, ax; while (L > 1 && arr.length) { what = a[--L]; while ((ax = arr.indexOf(what)) !== -1) { arr.splice(ax, 1); } } return arr; }

//function SubmitVariant(form) { $.validator.unobtrusive.parse(form); if ($(form).valid()) { $.ajax({ type: "POST", url: form.action, data: $(form).serialize(), success: function (data) { if (data.success) { } } }) } return false }

function SubmitModal(form, type) {

    var data = new FormData($(form)[0]);

    $.validator.unobtrusive.parse(form);

    if ($(form).valid()) {
        $.ajax({
            type: "POST",
            url: form.action,
            data: data,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.success) {
                    $("#vnnsoft-modal").hide();
                }
            }
        });
    } return false;
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


// Insert customer tags
$('body').on('keypress', '.customer-tags input.ui-widget-content', function (e) {
    if (e.keyCode == '13') {
        e.preventDefault();

        var inputClone = $(this).parent().clone();
        var liTag = "<li class=\"tagit-choice ui-widget-content ui-state-default ui-corner-all tagit-choice-editable\">" +
            "<span class=\"tagit-label\">" + $(this).val() + "</span><a class=\"tagit-close\"><span class=\"text-icon\">×</span>" +
            "<span class=\"ui-icon ui-icon-close\"></span></a><input type=\"hidden\" name class=\"tagit-hidden-field\" value=\"S\">" +
            "</li>";

        $(this).parent().parent().append(liTag);
        $(this).parent().parent().append(inputClone);
        $(this).parent().remove();

        // Clear text input
        $("ul.jindo-list-tags li.tagit-new input").val("");
        $(".jindo-list-tags .customer-tags input").focus();

        var tags = new Array();
        $("ul.jindo-list-tags li.tagit-choice").each(function (index, value) {
            tags.push($(value).find("span").html());
        });

        $("#CustomerTags").val(tags.toString());
    }
});



//function EditAltImage(data) {
//    var imageId = $(data).parent().parent().attr('id');
//    ShowModal("/Admin/Product/SetImageAlt/?imageId=" + imageId.substring(3));
//}



function VariantImage(event) {
    var productId = $(event).attr('product-id');
    var variantValue = $(event).html();

    ShowModal("/Admin/Product/VariantImage?productId=" + productId + "&" + "variantValue=" + variantValue);
}


// Insert Variant
$('body').on('keypress', '.product-variants input.ui-widget-content', function (e) {
    if (e.keyCode == '13') {
        e.preventDefault();

        var thisId = parseInt($(this).attr("name").match(/\d+/));
        var variantValue = "'[" + thisId + "].VariantValue'";
        var variantName = "'[" + thisId + "].VariantName'";
        var text = "'[" + thisId + "].VariantText'";
        var variantText = trim($("input[name=" + text + "]").val());

        // Nếu ko nhập thì thì lượn thoai
        if ($("input[name=" + text + "]").val().trim() == "") {
            return;
        }
    
        // labelText
        var labelText = "<a href='javascript:;' product-id='" + productId + "' onclick='VariantImage(this)'>" + $("input[name=" + text + "]").val() + "</a>";

        // Insert Variant vào Database
        var getVariantName = $("input[name=" + variantName + "]").val().trim();

        $.ajax({
            type: "POST",
            url: '/Admin/Product/InsertVariant',
            data: {
                productId: productId,
                variantName: getVariantName,
                variantValue: variantText
            },
            success: function (data) {
                if (data.success) {
                    var liTag = "<li class=\"tagit-choice ui-widget-content ui-state-default ui-corner-all tagit-choice-editable\">" +
                        "<span class=\"tagit-label\">" + labelText + "</span><a id=\"a-" + thisId + "\" class=\"variant-tagit-close tagit-close\"><span class=\"text-icon\">×</span>" +
                        "<span class=\"ui-icon ui-icon-close\"></span></a><input type=\"hidden\" name class=\"tagit-hidden-field\" value=\"S\">" +
                        "</li>";

                    $("ul#ul-id-" + thisId + "").append(liTag);

                    // Clear text input
                    $("input[name=" + text + "]").val("");

                    var inputClone = $("ul#ul-id-" + thisId + " .product-variants").clone();
                    $("ul#ul-id-" + thisId + " .product-variants").remove();
                    $("ul#ul-id-" + thisId + "").append(inputClone);

                    $("ul#ul-id-" + thisId + " .product-variants input").focus();

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
        thisElement.addClass("hide");
    }, 3000);
}


// Đưa Variant ra danh sách
function UpdateVariantInput(thisId) {
    var variantArr = [];
    var variantValue = "'[" + thisId + "].VariantValue'";

    $("ul#ul-id-" + thisId + " li").each(function (index) {
        variantArr.push($(this).find("span>a").html());
    });
    variantArr = variantArr.slice(0, -1);

    // Đưa dữ liệu ra input hiden - VariantValue
    $("input[name=" + variantValue + "]").val(variantArr.toString(), function () {
        console.log("Đưa dữ liệu ra input hiden");
    });

    GetVariantList();

    console.log("TEST: " + variantArr);
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


// Delete Item
function DeleteModal(id, title, message, type) {
    ShowModal("/Admin/Partial/DeleteItem/?id=" + id + "&title=" + title + "&message=" + message + "&type=" + type);
}

function EditAltImage(data) {
    var imageId = $(data).parent().parent().attr('id');
    ShowModal("/Admin/Product/SetImageAlt/?imageId=" + imageId.substring(3));
}

function ShowImage(data) {
    var imageId = $(data).parent().parent().attr('id');
    ShowModal("/Admin/Product/ImageView/?imageId=" + imageId.substring(3));
}

function OrderModal(orderId, orderCode, type) {
    ShowModal("/Admin/Order/OrderModal/?orderId=" + orderId + "&orderCode=" + orderCode + "&type=" + type);
}


function ConfirmShip(event) {
    var orderId = $(event).data("order-id");
    var orderCode = $(event).data("order-code");
    var url = "/Admin/Order/OrderModal/?orderId=" + orderId + "&orderCode=" + orderCode + "&type=" + "shipping";
    $(event).addClass("btn-loading");
    $(event).attr("disabled", true);

    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            $('#vnnsoft-modal').html(data);   // Đưa data vào
            $("#vnnsoft-modal").show();       // Show data

            $(".close-modal").on("click", function () {
                $("#vnnsoft-modal").hide();
            });

            $(event).removeClass("btn-loading");
            $(event).attr("disabled", false);
        }, error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}




function MarkPaid(event) {

    var orderCode = $(event).data("order-code");

    //console.log(orderCode);

    $.ajax({
        url: "/admin/order/markpaid",
        type: "POST",
        data: {
            orderCode: orderCode
        },
        success: function (data) {
            $(event).prop('disabled', true);
            console.log(data);
        }
    });
}


function ShowModal(url) {
    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
        
            $('#vnnsoft-modal').html(data);   // Đưa data vào
            $("#vnnsoft-modal").show();       // Show data

            $(".close-modal").on("click", function () {
                $("#vnnsoft-modal").hide();
            });
        }, error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });

    console.log(url);
}


function CancelOrder(orderId) {
    $.ajax({
        url: "/admin/order/cancelorder",
        data: {
            orderId: orderId
        },
        type: "POST",
        success: function (data) {
            console.log(data);
        }
    });
}


jindokuyo = {
    initOrder: function () {
        //
    },


    initProduct: function () {
        //
    },

    initEditProduct: function () {
        var optionVal = $('#InventoryManagement').val();

        if (optionVal == "True") {
            $(".kiotviet-product-id").removeClass("hide");
        }


        //$("#kiotviet-amount-check").attr("checked") ? $(".kiotviet-product-id").removeClass("hide") : alert("Unchecked");
    },

    initCategory: function () {
        $("div.next-input-wrapper input.next-radio").on("click", function (e) {
            var categoryId = $("#CategoryId").val();

            switch ($(this).attr("id")) {
                case "collection_type_sub":
                    $("#collectionTypeSub").removeClass("hide");
                    $("#collectionTypeMain").addClass("hide");
                    $("#collection_list option[value='" + categoryId + "']").attr('disabled', true);
                    break;
                case "collection_type_main":
                    $("#collectionTypeSub").addClass("hide");
                    $("#collectionTypeMain").removeClass("hide");
                    $("#ParentId").val('');
                    break;
                default:
            }
        });
    },

    initNews: function () {
        $("#collection_list").val($("#CategoryId").val());

        $("#collection_list").on("click", function () {
            $("#CategoryId").val($("#collection_list").val());

            console.log($("#collection_list").val());
        });

        var countTitle = $(".google__title").html().trim().length;

        $(".count-seo-title span").html(countTitle);
    },

    initUpload: function () {
        Dropzone.autoDiscover = false;
        var myDropzone = new Dropzone("div#jindoUpload", {
            maxFiles: 10,
            parallelUploads: 1,        // Upload đồng thời
            acceptedFiles: 'image/*',
            url: '/admin/product/UploadAlbum/' + productId,
            previewTemplate: document.querySelector('#template-preview').innerHTML,
            queuecomplete: function () {
                ImageSortable();            // Upload xong tất cả mới cho phép sắp xếp
                SetFeaturedImage();         // Upload xong thì cập nhập FeaturedImage
            },
            accept: function (file, done) {

                //console.log(file);

                if (file.type != "image/jpeg" && file.type != "image/png") {
                    alert("Lỗi! Không phải ảnh, không thể upload.");
                    this.removeFileNoSql(file);
                }
                else {
                    done();
                }
            }
            //addRemoveLinks: false
        });

        $.getJSON("/admin/product/GetAttachments/" + productId).done(function (data) {
            if (data.Data != '') {
                $.each(data.Data, function (index, item) {
                    //// Create the mock file:
                    var mockFile = {
                        name: item.FileName,
                        size: item.FileSize
                    };

                    // Call the default addedfile event handler
                    myDropzone.emit("addedfile", mockFile);

                    // And optionally show the thumbnail of the file:
                    myDropzone.emit("thumbnail", mockFile, "/uploads/products/" + productId + "/thumbs/" + item.FileName);

                    mockFile.previewElement.classList.add('dz-success');
                    mockFile.previewElement.classList.add('dz-complete');
                    mockFile.previewElement.classList.add('dz-processing');

                    $(mockFile.previewElement).prop('id', "id_" + item.AttachmentId);

                    myDropzone.files.push(mockFile);

                    ImageSortable();
                    resizeFirstImage();

                    // If you use the maxFiles option, make sure you adjust it to the
                    // correct amount:
                    //var existingFileCount = 1; // The number of files already uploaded
                    //myDropzone.options.maxFiles = myDropzone.options.maxFiles - existingFileCount;
                });
            }
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
            $(file.previewElement).attr("id", "id_" + response.attId);
            $(file.previewElement).find(".image-alt").attr("alt", response.altString);

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
            var fileName = $(file.previewElement).find(".image-alt").attr("alt");
            $.ajax({
                type: "POST",
                url: '/Admin/Product/DeleteImage',
                data: { productId: productId, fileName: fileName, fileSize: file.size },
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

        // Upload
        $('#imgSubmit').on('click', function (e) {
            $('div#jindoUpload').click();
        });


        // Clear Style của Div
        function ClearDivStyle() {
            $("div.dz-preview").each(function (index) {
                $("div.dz-preview").attr("style", "");
            });
        }
    }
};



function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#collection-image').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }

    if ($('#collection-image').parent().hasClass('hide') == true) {
        $('#collection-image').parent().removeClass('hide');
        $('#jindo-upload-box').addClass('hide');
        $('#jindo-tool-box').removeClass('hide');
    }
}


function readURLMobile(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#mobile-image').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }

    if ($('#mobile-image').parent().hasClass('hide') == true) {
        $('#mobile-image').parent().removeClass('hide');
        $('#mobile-upload-box').addClass('hide');
        $('#mobile-tool-box').removeClass('hide');
    }
}


function readURLICON(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#icon-image').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }

    if ($('#icon-image').parent().hasClass('hide') == true) {
        $('#icon-image').parent().removeClass('hide');
        $('#icon-upload-box').addClass('hide');
        $('#icon-tool-box').removeClass('hide');
    }
}


// Upload ảnh desktop
$("#collection-upload-image").change(function () {
    readURL(this);
});


// Upload ảnh mobile
$("#mobile-upload-image").change(function () {
    readURLMobile(this);
});


// Upload ảnh icon
$("#icon-upload-image").change(function () {
    readURLICON(this);
});


// Xóa bỏ ảnh Upload
$("#ClearFileButton").on("click", function () {
    $("#collection-upload-image").val(null);
    $("#collection-image").parent().addClass('hide');
    $("#jindo-upload-box").removeClass("hide");
    $('#jindo-tool-box').addClass('hide');


    switch ($(this).attr("data-type")) {
        case "category":
            $.ajax({
                url: "/Admin/ProductCategory/DeleteImage",
                type: 'POST',
                data: {
                    id: $(this).attr("data-id")
                },
                beforeSend: function () {
                    //
                },
                success: function (data) {
                    //console.log("thành công.");
                }
            });
            break;
        default:
    }
});

$('#UpdatePhoto').on('click', function (e) {
    $('#collection-upload-image').click();
});

$('#UpdatePhotoMobile').on('click', function (e) {
    $('#mobile-upload-image').click();
});

$('#UpdatePhotoIcon').on('click', function (e) {
    $('#icon-upload-image').click();
});


$("#collection_list").on("click", function () {
    $("#ParentId").val($("#collection_list").val());
});


$("#AddSummaryButton").on("click", function () {
    $("#box-summary").removeClass("hide");
    $(this).addClass("hide");
});


$("#AddFeatureButton").on("click", function () {
    var featureId = "0";
    ShowModal("/Admin/Product/AddFeature?productId=" + productId + "&" + "featureId=" + featureId);
});


$("#AddCommissionButton").on("click", function () {
    var commissionId = "0";

    ShowModal("/Admin/Product/AddCommission?productId=" + productId + "&" + "commissionId=" + commissionId);
});



function SubmitCommission(form) {
    var data = new FormData($(form)[0]);
    $.validator.unobtrusive.parse(form);

    var giatriGiamGia = $("#GiaTriGiamGia").val();
    var giatriHoaHong = $("#HoaHong").val();

    var loaiGiamGia = $("#LoaiGiamGia").val();
    var loaiHoaHong = $("#LoaiHoaHong").val();

    var giamacdinh = $("#AddCommissionForm #main-price").data("price-default");
    var duocgiam = "";
    var duochoahong = "";

    if (loaiGiamGia == "phantram") {
        duocgiam = (giamacdinh / 100 * giatriGiamGia);
        giatriGiamGia = giatriGiamGia + "%";
    } else if (loaiGiamGia == "tructiep") {
        giatriGiamGia = $.number(giatriGiamGia).replace(/,/g, ".") + " ₫";
    }


    if (loaiHoaHong == "phantram") {
        duochoahong = (giamacdinh / 100 * giatriHoaHong);
        giatriHoaHong = giatriHoaHong + "%";
    } else if (loaiHoaHong == "tructiep") {
        giatriHoaHong = $.number(giatriHoaHong).replace(/,/g, ".") + " ₫";
    }

    console.log(loaiHoaHong);
    console.log(giatriHoaHong);


    if ($(form).valid()) {
        $.ajax({
            type: "POST",
            url: form.action,
            data: data,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.success) {
                    if (data.type == "create") {
                        if (loaiGiamGia == "phantram") {
                            $('#product-commission-list tbody').append(
                                //'<tr id="commission-row-' + data.data.commissionId + '">' +
                                //'<td onclick="EditCommission(' + data.data.commissionId + ')">' +
                                //giatriGiamGia + '</td><td onclick="EditCommission(' + data.data.commissionId + ')">' +
                                //'-' + $.number(duocgiam).replace(/,/g, ".") + ' ₫' + '</td>' +
                                //'<td>+ ' + $.number(duochoahong).replace(/,/g, ".") + ' đ</td>' +
                                //'<td onclick="DeleteCommission(' + data.data.commissionId + ')">' +
                                //'<img src="/Content/images/icon-delete-16.jpg" width="15" alt="Xóa">'
                                //+ '</td>' +
                                //'</tr>'
                                '<tr id="feature-row-' + data.data.commissionId + '">' +
                                '<td onclick="EditCommission(' + data.data.commissionId + ')">' +
                                '<span>' + 'Giảm giá ' + giatriGiamGia + ' / ' + $.number(duocgiam).replace(/,/g, ".") + ' ₫' +
                                '</span>' +
                                '</td>' +
                                '<td onclick="EditCommission(' + data.data.commissionId + ')">' +
                                '<span>Hoa hồng ' + giatriHoaHong + ' / ' + $.number(duochoahong).replace(/,/g, ".") + ' ₫</span>' +
                                '</td>' +
                                '<td onclick="DeleteCommission(' + data.data.commissionId + ')">' +
                                '<img src="/Content/images/icon-delete-16.jpg" width="15" alt="Xóa">' +
                                '</td>' +
                                '</tr>'
                            );
                        } else if (loaiGiamGia == "tructiep") {
                            $('#product-commission-list tbody').append(
                                ////'<tr id="commission-row-' + data.data.commissionId + '">' +
                                ////'<td onclick="EditCommission(' + data.data.commissionId + ')">' +
                                ////giatriGiamGia + '</td><td onclick="EditCommission(' + data.data.commissionId + ')">' +
                                ////'-' + '</td>' +
                                ////'<td>+ ' + $.number(giatriHoaHong).replace(/,/g, ".") + ' đ</td>' +
                                ////'<td onclick="DeleteCommission(' + data.data.commissionId + ')">' +
                                ////'<img src="/Content/images/icon-delete-16.jpg" width="15" alt="Xóa">'
                                ////+ '</td>' +
                                ////'</tr>'
                                '<tr id="commission-row-' + data.data.commissionId + '">' +
                                '<td onclick="EditCommission(' + data.data.commissionId + ')">' +
                                '<span>Giảm giá 300.000  ₫</span>' +
                                '</td>' + 
                                '<td onclick="EditCommission(' + data.data.commissionId + ')">' +
                                '<span>Hoa hồng 120.000  ₫</span>' +
                                '</td>' +
                                '<td onclick="DeleteCommission(' + data.data.commissionId + ')">' +
                                '<img src="/Content/images/icon-delete-16.jpg" width="15" alt="Xóa">' +
                                '</td>' +
                                '</tr>'
                            );
                        }                       
                    } else {
                        // Update
                        $("tr#commission-row-" + data.data.commissionId + " >td:first-child").html(title);
                        $("tr#commission-row-" + data.data.commissionId + " >td:last-child").html(loaiGiamGia);
                    }

                    $("#commissionTypeMain").removeClass("hide");
                    $("#commissionNoRows").addClass("hide");
                    $("#vnnsoft-modal").hide();
                }
            }
        })
    } return false;

}


// Xác nhận chuyển hàng
function SubmitShip(form) {
    var data = new FormData($(form)[0]);
    $.validator.unobtrusive.parse(form);

    $(form).find(':submit').addClass("btn-loading");
    //$(event).addClass("btn-loading");

    if ($(form).valid()) {
        $.ajax({
            type: "POST",
            url: form.action,
            data: data,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.success) {
                    $("#vnnsoft-modal").hide();
                    $("#confirmship").attr("disabled", true).html("Đang lấy hàng");
                } else {

                }
            }
        });
    } return false;
}


// Add - đặc điểm nổi bật
function SubmitFeature(form) {
    var data = new FormData($(form)[0]);
    $.validator.unobtrusive.parse(form);

    var productId = $("#ProductId").text($("form").serialize()).val();
    var featureId = $("#FeatureId").text($("form").serialize()).val();
    var title = $("#Title").text($("form").serialize()).val();
    var desc = $("#Desc").text($("form").serialize()).val();


    if ($(form).valid()) {
        $.ajax({
            type: "POST",
            url: form.action,
            data: data,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.success) {
                    if (data.type == "create") {
                        $('#product-feature-list tbody').append('<tr id="feature-row-' + data.data.featureId + '"><td onclick="EditFeature(' + data.data.featureId + ')">' + title + '</td><td onclick="EditFeature(' + data.data.featureId + ')">' + desc + '</td>' + '<td onclick="DeleteFeature(' + data.data.featureId + ')">Xóa</td>' + '</tr>');
                    } else {
                        // Update
                        $("tr#feature-row-" + data.data.featureId + " >td:first-child").html(title);
                        $("tr#feature-row-" + data.data.featureId + " >td:last-child").html(desc);
                    }

                    $("#featureTypeMain").removeClass("hide");
                    $("#featureNoRows").addClass("hide");
                    $("#vnnsoft-modal").hide();
                } else {
                    console.log("test tets");
                }
            }
        });
    } return false;
}


function EditFeature(featureId) {
    ShowModal("/Admin/Product/EditFeature/?featureId=" + featureId);
}


// Upload ảnh đại diện
function UploadAvatar(productId) {
    ShowModal("/Admin/Product/UploadAvatar/?productId=" + productId);
}


// Upload ảnh nền
function UploadBackground(productId) {
    ShowModal("/Admin/Product/UploadBackground/?productId=" + productId);
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LIST INDEX
// Array chứa danh sách sản phẩm
var idSelected = new Array();
var arrFilter = new Array;
var query = getUrlParameter('query');

$("#jindo-box-search").val(queryResult(query));

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

function selectFilterValue(event, type) {
    switch ($(event).attr("data-bind")) {
        case $(event).attr("data-bind"):
            arrFilter[$(event).attr("data-bind")] = $(event).val();
            break;
        default:
    }

    SearchListResult(type);
    dropdownFilter(null, true);
}


$("#add_filter_button").on("click", function () {

    if ($("#tagswith").val() == "") {
        return;
    }

    switch ($("#tagswith").attr("data-bind")) {
        case $("#tagswith").attr("data-bind"):
            arrFilter[$("#tagswith").attr("data-bind")] = $("#tagswith").val().replace(/ /g, '+');;
            break;
        default:
    }

    SearchListResult($("#tagswith").attr("data-type"));
    //dropdownFilter(null, true);
});


// Load phần tử đã chọn và hiển thị
function loadFilterList(type) {
    $("#jindo-filter-list ul.ui-tags li").remove();
    for (var key in arrFilter) {
        var key_display = "";
        var value_display = "";


        console.log(key);

        switch (key) {
            case "published_status":
                key_display = "Trạng thái: ";
                break;
            case "product_type":
                key_display = "Danh mục: ";
                break;
            case "accepts_marketing":
                key_display = "Nhận quảng cáo: ";
                break;
            case "categories_promotion":
                key_display = "Danh mục khuyến mãi: ";
                break;
            case "tag":
                key_display = "Tag: ";
                break;
            default:
                key_display = key;
                break;
        }


        console.log("sssssss" + arrFilter[key]);

        switch (arrFilter[key]) {
            case "true":
                if (key == "published_status")
                    value_display = "hiện";
                else if (key == "categories_promotion")
                    value_display = "hiển thị";
                break;
            case "false":
                if (key == "published_status")
                    value_display = "ẩn";
                else
                    value_display = "không";
                break;
            case "showlist":
                if (key == "categories_promotion")
                    value_display = "hiện";
                break;
            default:
                value_display = arrFilter[key].replace(/\+/g, ' ');;
                break;
        }

        var typeJindo = "'" + type + "'";
        var myvar = '<li class="ui-tag">' +
            '             <span class="ui-tag__label">' + key_display + value_display + '</span>' +
            '             <button data-filter-key=' + key + ' type="button" name="button" aria-label="Remove tag" class="ui-tag__remove-button" onclick="removeFilter(this,' + typeJindo + ')"><svg style="margin-top:-3px" aria-hidden="true" focusable="false" class="next-icon next-icon--color-slate-lighter next-icon--size-12"> <use xlink:href="#next-remove"></use> </svg></button>' +
            '        </li>';

        $("#jindo-filter-list ul.ui-tags").append(myvar);
    }

    if ($("#jindo-filter-list ul.ui-tags li.ui-tag").length > 0) {
        $("#jindo-filter-list").removeClass("hide");
    }
}

function removeFilter(event, type) {
    delete arrFilter[$(event).attr("data-filter-key")];
    SearchListResult(type);

    if ($("#jindo-filter-list ul.ui-tags li").length == 0) {
        $("#jindo-filter-list").addClass("hide");
    }
}

function replaceUrl(type) {
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

    switch (type) {
        case 'product':
            window.history.pushState("Tìm kiếm", "query", "/admin/product?" + url);
            break;
        case 'category':
            window.history.pushState("Tìm kiếm", "query", "/admin/collections?" + url);
            break;
        case 'news':
            window.history.pushState("Tìm kiếm", "query", "/admin/news?" + url);
            break;
        case 'customers':
            window.history.pushState("Tìm kiếm", "query", "/admin/customers?" + url);
            break;
        case 'customer_groups':
            window.history.pushState("Tìm kiếm", "query", "/admin/customer_groups?" + url);
            break;
        case 'discount':
            window.history.pushState("Tìm kiếm", "query", "/admin/discounts?" + url);
            break;
        case 'brand':
            window.history.pushState("Tìm kiếm", "query", "/admin/brands?" + url);
            break;
        case 'supplier':
            window.history.pushState("Tìm kiếm", "query", "/admin/suppliers?" + url);
            break;
        case 'page':
            window.history.pushState("Tìm kiếm", "query", "/admin/pages?" + url);
            break;
        default:
    }

    return "?" + url;
}


function SearchListResult(type) {
    switch (type) {
        case 'product':
            $("#jindo-data-results").load("/admin/product" + replaceUrl(type) + " #data-results");
            break;
        case 'category':
            $("#jindo-data-results").load("/admin/collections" + replaceUrl(type) + " #data-results");
            break;
        case 'news':
            $("#jindo-data-results").load("/admin/news" + replaceUrl(type) + " #data-results");
            break;
        case 'customers':
            $("#jindo-data-results").load("/admin/customers" + replaceUrl(type) + " #data-results");
            break;
        case 'customer_groups':
            $("#jindo-data-results").load("/admin/customer_groups" + replaceUrl(type) + " #data-results");
            break;
        case 'discount':
            $("#jindo-data-results").load("/admin/discounts" + replaceUrl(type) + " #data-results");
            break;
        case 'brand':
            $("#jindo-data-results").load("/admin/brands" + replaceUrl(type) + " #data-results");
            break;
        case 'supplier':
            $("#jindo-data-results").load("/admin/suppliers" + replaceUrl(type) + " #data-results");
            break;
        case 'page':
            $("#jindo-data-results").load("/admin/pages" + replaceUrl(type) + " #data-results");
            break;
        case 'slider':
            $("#jindo-data-results").load("/admin/slider" + replaceUrl(type) + " #data-results");
            break;
        default:
    }

    // Load lại danh sách hiển thị Filter
    loadFilterList(type);

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
        query = text.replace(/\ /g, "+");
        SearchListResult(type);

        var sortPath = window.location.pathname.toString().toLowerCase() + decodeURIComponent(window.location.search);

        if (sortPath != "/admin/customers" || sortPath != "/admin/customers?query=" || sortPath != "/admin/customer_groups" || sortPath != "/admin/customer_groups?query=" ||
            sortPath != "/admin/brands" || sortPath != "/admin/brands?query=" ||
            sortPath != "/admin/suppliers" || sortPath != "/admin/suppliers?query=") {

            $("#customSearch").removeClass("hide");

            $("ul.jindo-next-tab li.next-jindo-tab").find("a.next-tab").removeClass("next-tab--is-active");
            $("ul.jindo-next-tab li:first").find("a").removeClass("next-tab--is-active");
        }
        if (sortPath == "/admin/customers" || sortPath == "/admin/customers?query=" || sortPath == "/admin/customer_groups" || sortPath == "/admin/customer_groups?query=" ||
            sortPath == "/admin/brands" || sortPath == "/admin/brands?query=" ||
            sortPath == "/admin/suppliers" || sortPath == "/admin/suppliers?query=") {
            $("#customSearch").addClass("hide");
            $("ul.jindo-next-tab li:first").find("a").addClass("next-tab--is-active");
        }

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
    //
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
    $("#all-items tbody tr").each(function (i, val) {
        if ($(val).find(".product-check").attr("checked") == "checked") {
            idSelected.push($(val).find(".product-check").val());
        }
    });

    //
    if (idSelected.length == 1) {
        $("#collections-promotion-mark").removeClass("disabled");
    } else {
        $("#collections-promotion-mark").addClass("disabled");
    }
    //console.log("đã chọn: " + idSelected);

    HeaderSelectBar(idSelected.length);
    ProductSelected(idSelected.length);
}


function ProductSelected(length) {
    var countRows = $("#all-items tbody tr").length;
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
    if (idSelected.length == 0 || idSelected.length < $("#all-items tbody tr").length) {
        idSelected = []; // Reset lại danh sách sản phẩm đã chọn
        $("#all-items tbody tr").each(function (i, val) {
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
    } else if (idSelected.length == $("#all-items tbody tr").length) {
        $("#all-items tbody tr").each(function (i, val) {
            $(this).find("input").attr('checked', false).css("border", "#c4cdd5");
            $(this).removeClass("selected");
            $(this).find(".next-checkbox--styled .checkmark").css("-webkit-transform", "scale(0)");
        });
        idSelected = [];

        $(".next-checkbox--styled").css("border-color", "#c4cdd5");
        $(".next-checkbox--styled .jindo-next-icon.checkmark").css("-webkit-transform", "scale(0)");
        $(".next-checkbox--styled .jindo-next-icon.indeterminate").css("-webkit-transform", "scale(0)");
    }

    // Ẩn 1 số tùy chọn
    if (idSelected.length > 1) {
        $("#collections-promotion-mark").addClass("disabled");
    }

    HeaderSelectBar(idSelected.length);
}


// Đánh dấu đã chọn
function markPromotion() {
    //console.log(idSelected);

    $("table#all-items tbody tr").each(function (index) {
        $(this).find("span.badge--status-mark").html("");
    });

    $("tr#id_" + idSelected + " td.name div.ui-stack-item span").addClass("badge badge--status-mark").html("Nổi bật");

    // Cập nhật database
    $.ajax({
        url: "/Admin/ProductCategories/MarkPromotion",
        type: 'POST',
        data: {
            catId: idSelected
        },
        beforeSend: function () {
            //
        },
        success: function (data) {
            location.reload();
        }
    });
}


function HeaderSelectBar(length) {
    if (length > 0) {
        $("#CountItem").html(length);        // Count số lượng sản phẩm đã chọn
        $(".jindo-select-all").addClass("bulk-actions__select-all--has-selected-items");
        $(".tooltip-container").addClass("hide");
        $(".bulk-actions").addClass("bulk-actions--is-visible");
        $(".jindo-select-label").removeClass("bulk-actions__select-all-btn btn-slim btn next-label next-label--switch");
        $(".bulk-select-all p").addClass("hide");

        if (length == $("#all-items tbody tr").length) {
            $(".bulk-select-all p").removeClass("hide");
        }
    } else {
        $(".jindo-select-all").removeClass("bulk-actions__select-all--has-selected-items");
        $(".tooltip-container").removeClass("hide");
        $(".bulk-actions").removeClass("bulk-actions--is-visible");
        $(".jindo-select-label").addClass("bulk-actions__select-all-btn btn-slim btn next-label next-label--switch");

        // Nếu không chọn sản phẩm nào thì border về màu mặc định
        $("#all-items thead tr th .next-checkbox--styled").css("border-color", "#c4cdd5");
    }
}



function actionClick(event) {
    if ($(event).hasClass("ui-popover__container--contains-active-popover")) {
        $(event).removeClass("ui-popover__container--contains-active-popover");
        $(event).find(".jindo-action-dropdown").removeClass("ui-popover ui-popover--full-height ui-popover--is-positioned-beneath ui-popover--is-active").addClass("ui-popover ui-popover--full-height");
    } else {
        $(event).addClass("ui-popover__container--contains-active-popover");
        $(event).find(".jindo-action-dropdown").removeClass("ui-popover ui-popover--full-height").addClass("ui-popover ui-popover--full-height ui-popover--is-positioned-beneath ui-popover--is-active");
        $("#all-items").find(".jindo-select-label").removeClass("bulk-actions__select-all-btn btn-slim btn next-label next-label--switch");
    }
}


// Edit product số lượng lớn
function bulkEdit() {
    $.redirect("/admin/products/BulkEditor", { dataArr: idSelected }, "POST", "_self");
}


function deleteSelected(type) {
    if (type == "product") {
        $.redirect("/admin/product/DeleteSelected", { dataArr: idSelected }, "POST", "_self");
    } else if (type == "productcategory") {
        $.redirect("/admin/productcategory/DeleteSelected", { dataArr: idSelected }, "POST", "_self");
    } else if (type == "productbrand") {
        $.redirect("/admin/brand/DeleteSelected", { dataArr: idSelected }, "POST", "_self");
    } else if (type == "productsupplier") {
        $.redirect("/admin/productsuppliers/DeleteSelected", { dataArr: idSelected }, "POST", "_self");
    }
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


var oTimeoutGiamGia;
function tinhgiamgia() {
    clearTimeout(oTimeoutGiamGia);
    var n = $("#GiaTriGiamGia").val();
    if (n == "" || n.length == 0) {
        $("span.ketquaduocgiam").html("");
        return !0;
    }

    var currentPrice = $("#GiaTriGiamGia").parent().data("price-default");
    var currentType = $("#LoaiGiamGia").val();
    var ketqua = 0;

    oTimeoutGiamGia = setTimeout(function () {
        if (currentType == "phantram") {
            ketqua = (currentPrice / 100) * n;
            $("span.ketquaduocgiam").html("-" + $.number(ketqua).replace(/,/g, ".") + " ₫");
        } else if (currentType == "tructiep") {
            ketqua = 0;
            $("span.ketquaduocgiam").html(" ₫");
        }
    }, 100)
}


var oTimeoutHoaHong;
function tinhhoahong() {
    clearTimeout(oTimeoutHoaHong);
    var n = $("#HoaHong").val();
    if (n == "" || n.length == 0) {
        $("span.ketquaduocgiam").html("");
        return !0;
    }

    var currentPrice = $("#HoaHong").parent().data("price-default");
    var currentType = $("#LoaiHoaHong").val();
    var ketqua = 0;

    oTimeoutHoaHong = setTimeout(function () {
        if (currentType == "phantram") {
            ketqua = (currentPrice / 100) * n;
            $("span.hoahongnhan").html("-" + $.number(ketqua).replace(/,/g, ".") + " ₫");
        } else if (currentType == "tructiep") {
            ketqua = 0;
            $("span.hoahongnhan").html(" ₫");
        }
    }, 100)
}


function chonkieugiamgia(data) {
    var currentType = $("#LoaiGiamGia").val();
    var currentPrice = $("#GiaTriGiamGia").parent().data("price-default");
    var n = $("#GiaTriGiamGia").val();

    if (currentType == "tructiep") {
        $("span.ketquaduocgiam").html(" ₫");
    } else if (currentType == "phantram") {
        var ketqua = (currentPrice / 100) * n;
        $("span.ketquaduocgiam").html("-" + $.number(ketqua).replace(/,/g, ".") + " ₫");
    }
}


function chonkieuhoahong(data) {
    var currentType = $("#LoaiHoaHong").val();
    var currentPrice = $("#HoaHong").parent().data("price-default");
    var n = $("#HoaHong").val();

    if (currentType == "tructiep") {
        $("span.hoahongnhan").html(" ₫");
    } else if (currentType == "phantram") {
        var ketqua = (currentPrice / 100) * n;
        $("span.hoahongnhan").html("-" + $.number(ketqua).replace(/,/g, ".") + " ₫");
    }
}



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


// Edit Customer
function CloseModal() {
    $("#admin-next-layered #modal_container").css("display", "none");
    $("#admin-next-layered .modal-bg").removeClass("visible");

    $("#admin-next-layered #modal_container div").remove();
}


function EditCustomer(customerId, func, forTable, forTableId) {
    var url = "";
    if (func == "customer") {
        url = "/Admin/Customer/EditCustomer?customerId=" + customerId + "&" + "forTable=" + forTable + "&" + "forTableId=" + forTableId;
    } else if (func == "address") {
        url = "/Admin/Customer/EditAddress?customerId=" + customerId + "&" + "forTable=" + forTable + "&" + "forTableId=" + forTableId;
    }

    $.ajax({
        type: "GET",
        url: url,
        beforeSend: function () {
            $("#customer-modal").remove();
        },
        success: function (data) {
            $("#modal_container").append(data);
            $("#admin-next-layered #modal_container").css("display", "block");
            $("#admin-next-layered .modal-bg").addClass("visible");
        }
    });
}


// CHECKBOX - Yêu Cầu Vận Chuyển
if ($("#variant-requires_shipping").attr("checked") == "checked") {
    $("#requires_shipping .next-checkbox--styled .checkmark").css("-webkit-transform", "scale(1)");
    $("input[name='RequiresShipping']").val("true");
}

$("#variant-requires_shipping").on("click", function () {
    if ($("#variant-requires_shipping").attr("checked") == "checked") {
        $("#requires_shipping .next-checkbox--styled .checkmark").css("-webkit-transform", "scale(0)");
        $("input[name='RequiresShipping']").val("false");
        $("#variant-requires_shipping").attr("checked", false);
    } else {
        $("#requires_shipping .next-checkbox--styled .checkmark").css("-webkit-transform", "scale(1)");
        $("input[name='RequiresShipping']").val("true");
        $("#variant-requires_shipping").attr("checked", true);
    }
});


// CheckOutOfStock
if ($("#CheckOutOfStock").attr("checked") == "checked") {
    $("#Out_OfStock .next-checkbox--styled .checkmark").css("-webkit-transform", "scale(1)");
    $("input[name='OutOfStock']").val("true");
}

$("#CheckOutOfStock").on("click", function () {
    if ($("#CheckOutOfStock").attr("checked") == "checked") {
        $("#Out_OfStock .next-checkbox--styled .checkmark").css("-webkit-transform", "scale(0)");
        $("input[name='OutOfStock']").val("false");
        $("#CheckOutOfStock").attr("checked", false);
    } else {
        $("#Out_OfStock .next-checkbox--styled .checkmark").css("-webkit-transform", "scale(1)");
        $("input[name='OutOfStock']").val("true");
        $("#CheckOutOfStock").attr("checked", true);
    }
});




//if ($("#kiotviet-amount-check").attr("checked") == "checked") {
//    $("#kiotviet_sync .next-checkbox--styled .checkmark").css("-webkit-transform", "scale(1)");
//    $("input[name='KiotVietSync']").val("true");
//}


//$("#kiotviet-amount-check").on("click", function () {
//    console.log("dfdsfdsfd32");
//});

//if ($("#kiotviet-amount-check").val() == "True") {
//    $(".kiotviet-amount-check .next-checkbox--styled .checkmark").css("-webkit-transform", "scale(1)");
//}


//$("#kiotviet-amount-check").on("click", function () {
//    if ($("#kiotviet-amount-check").attr("checked") == "checked") {
//        $(".soluong-tonkho").addClass("hide");
//        $(".kiotviet-product-id").removeClass("hide");
//        $(".kiotviet-amount-check .next-checkbox--styled .checkmark").css("-webkit-transform", "scale(0)");
//    } else {
//        $(".soluong-tonkho").removeClass("hide");
//        $(".kiotviet-product-id").addClass("hide");
//        $(".kiotviet-amount-check .next-checkbox--styled .checkmark").css("-webkit-transform", "scale(1)");
//    }
//});
// END CHECKBOX



function DeleteDialog(id) {
    $.ajax({
        type: "GET",
        url: "/Admin/Customer/DeleteDialog?id=" + id,
        beforeSend: function () {
            $("#delete-modal").remove();
        },
        success: function (data) {
            $("#modal_container").append(data);
            $("#admin-next-layered #modal_container").css("display", "block");
            $("#admin-next-layered .modal-bg").addClass("visible");
        }
    })
}

function CustomerNoteEditor() {
    clearTimeout(delayTimer);

    delayTimer = setTimeout(function () {
        var id = $("#CustomerId").val();
        var content = $("#customer_note").html();

        $.ajax({
            type: "POST",
            url: '/Admin/Customer/CustomerNote',
            data: {
                id: id,
                content: content
            },
            success: function (data) {
                console.log(data);
            }
        })
    }, 800);
}


//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
var couponInput = false;
var discountInput = false;
var minPurchaseInput = false;
var limitedUsedInput = false;
var prefix = "%";
var appliesTo = "toàn bộ đơn hàng";

$("#CouponCode").keyup(function () {
    couponInput = true;

    if ($(this).val() == "") {
        couponInput = false;
    } else {
        couponInput = true;
    }
});

$("#MinimumPurchase").keyup(function () {
    minPurchaseInput = true;

    if ($(this).val() == "") {
        minPurchaseInput = false;
    } else {
        minPurchaseInput = true;
    }
});

$("#LimitedUsed").keyup(function () {
    limitedUsedInput = true;

    if ($(this).val() == "") {
        limitedUsedInput = false;
    } else {
        limitedUsedInput = true;
    }
})


$("#discount_next_percentage_value, #discount_next_amount_value").keyup(function () {
    switch ($(this).attr("id")) {
        case "discount_next_percentage_value":
            $("#DiscountValue").val($("#" + $(this).attr("id")).val());
            break;
        case "discount_next_amount_value":
            $("#DiscountValue").val($("#" + $(this).attr("id")).val());
            break;
        default:
    }

    if ($("#DiscountValue").val().length > 0) {
        discountInput = true;
    } else {
        discountInput = false;
    }
});



$("#CouponCode, #discount_next_percentage_value, #discount_next_amount_value, #MinimumPurchase, #LimitedUsed").keyup(function () {
    SummaryBox();
})


$("#discount_next_applies_to_cart").on("click", function () {
    appliesTo = "toàn bộ đơn hàng";
    $("#DiscountFor").val("Order");
    $("#product-search-input").addClass("hide");
    SummaryBox();
});

$("#discount_next_applies_to_products").on("click", function () {
    appliesTo = "sản phẩm";
    $("#DiscountFor").val("Product");
    $("#product-search-input").removeClass("hide");
    SummaryBox();
});

$("#discount_next_minimum_selection_none").on("click", function () {
    $("#MinimumPurchase").val("");
    $("#minimum-purchase-input").addClass("hide");
    minPurchaseInput = false;
    SummaryBox();
});

$("#discount_next_minimum_selection_subtotal").on("click", function () {
    $("#MinimumPurchase").val("");
    $("#minimum-purchase-input").removeClass("hide");
    SummaryBox();
});

$("#discount_next_limit_total_use").on("click", function () {
    if ($(this).val() == "") {
        $(this).val("1");
        $("#limited-use-selected").removeClass("hide");
        SummaryBox();
        return;
    }

    if ($(this).val() == 1) {
        $(this).val("");
        $("#limited-use-selected").addClass("hide");
        $("#LimitedUsed").val("");
        limitedUsedInput = false;
        SummaryBox();
        return;
    }
});

function SummaryBox() {
    // couponInput
    if (couponInput == true) {
        $(".summary-card__header").removeClass("hide");
        $(".summary-card__code").html($("#CouponCode").val().toUpperCase());
    } else {
        $(".summary-card__header").addClass("hide");
    }

    // discountInput
    if (discountInput == true) {
        $("#percentage_label").removeClass("hide");
        $("#percentage_label").html("Giảm " + $("#DiscountValue").val() + prefix + " cho " + appliesTo);

        if (prefix == "freeship") {
            $("#percentage_label").html("Miễn phí vận chuyển cho toàn bộ đơn hàng");
        }
    } else {
        $("#percentage_label").addClass("hide");
    }

    // Số tiền mua tối thiểu
    if (minPurchaseInput == true) {
        $("#min_purchase").removeClass("hide");
        $("#min_purchase").html("Số tiền mua tối thiểu " + $("#MinimumPurchase").val() + "đ");
    } else {
        $("#min_purchase").addClass("hide");
    }

    // LimitedUsed
    if (limitedUsedInput == true) {
        $("#limited_used").removeClass("hide");
        $("#limited_used").html("Mã được phép sử dụng " + $("#LimitedUsed").val() + " lần");
    } else {
        $("#limited_used").addClass("hide");
    }

    $("#minimum-purchase-label").html("Áp dụng cho " + appliesTo);

    // Summary
    if (couponInput == false && discountInput == false && minPurchaseInput == false && limitedUsedInput == false) {
        $("#message-no-input").removeClass("hide");
    } else {
        $("#message-no-input").addClass("hide");
    }

    console.log(limitedUsedInput);
}


function generateCode() {
    couponInput = true;

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 12; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    $("#CouponCode").val(text.toUpperCase());
    $(".discount-code.summary-card__code").html(text.toUpperCase());

    SummaryBox();
}


function discountTypeChanged(event) {
    switch ($(event).val()) {
        case "percentage":
            $(".discount-value-percentage").removeClass("hide");
            $(".discount-value-amount").addClass("hide");
            $("#DiscountValue").val($("#discount_next_percentage_value").val());
            prefix = "%";
            break;
        case "amount":
            $(".discount-value-amount").removeClass("hide");
            $(".discount-value-percentage").addClass("hide");
            $("#DiscountValue").val($("#discount_next_amount_value").val());
            prefix = "đ";
            break;
        case "free_shipping":
            $(".discount-value-amount").addClass("hide");
            $(".discount-value-percentage").addClass("hide");
            $("#DiscountValue").val("");
            prefix = "freeship";
            break;
        default:
    }

    if ($("#DiscountValue").val().length > 0 || prefix == "freeship") {
        discountInput = true;
    } else {
        discountInput = false;
    }

    SummaryBox();
}


