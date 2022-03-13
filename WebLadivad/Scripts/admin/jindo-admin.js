

// CREATE PRODUCT
$('.uploadfile').click(function (e) {
    e.preventDefault();
    var target = $(this).attr('upload-to');
    var Ckfinder = new CKFinder();
    Ckfinder.selectActionFunction = function (url) {
        $(target).val(url);
    }
    Ckfinder.popup();
});

$('.uploadfile').click(function (e) {
    e.preventDefault();
    var target = $(this).attr('upload-to');
    var previewTo = $(this).attr('previewTo');

    var Ckfinder = new CKFinder();
    Ckfinder.selectActionFunction = function (url) {
        $(target).val(url);
        $("#productPreview").attr("src", url);
    }
    Ckfinder.popup();
});

$('.multiuploadfile').click(function (e) {
    e.preventDefault();
    var target = $(this).attr('upload-to');
    var previewTo = $(this).attr('previewTo');

    var Ckfinder = new CKFinder();
    Ckfinder.selectActionFunction = function (url) {
        var cur = $(target).val();
        var li = '<li><img src="' + url + '" style="height: 80px; width: 80px;"/><a href="' + url + '" class="btnDelImage" hiddenVal="' + target + '"><i class="fa fa-close"></i></a></li>';
        if (cur == '') {
            $(target).val(url);
        } else {
            $(target).val(cur + ',' + url);
        }

        $(previewTo).append(li);
        bindingDeleteImage();
    }
    Ckfinder.popup();
});

$('#categories-list').click(function (e) {
    e.preventDefault();
    var catId = $('#categories-list :selected').val();

    $("#CategoryId").val(catId);
});

bindingDeleteImage();
function bindingDeleteImage() {
    $('.btnDelImage').click(function (e) {
        e.preventDefault();
        var image = $(this).attr('href');
        var hiddenId = $(this).attr('hiddenVal');
        var hiddenVal = $(hiddenId).val();

        console.log(hiddenId);

        //remove image from hidden value
        hiddenVal = hiddenVal.replace(image + ',', ''); //truong hop co ten,
        hiddenVal = hiddenVal.replace(image, ''); //truong dung cuoi chuoi khong co dau (,)
        //Binding lai vao hidden
        $(hiddenId).val(hiddenVal);

        //Xoa li chua hinh anh
        $(this).closest('li').remove();
    });
}


var postId = $('#ProductId').val();
var count = 0;


$('#box-list-variants').on('click', function () {
    //$("#AddVariant").load("/Admin/Product/AddVariant/@ViewBag.GetId" + " .modal-dialog");
    $("#AddVariant").load("/Admin/Product/AddVariant/" + postId + " .modal-dialog");

    count = 0;

    setTimeout(function () {
        if ($('#Price').val() != "") {
            $('.price-basic').val($('#Price').val());
            $(".price-basic-div .label-floating").removeClass("is-empty");
        } else {
            $('.price-basic').val("");
        }
        $('.price-basic').on('input', function () {
            $('#Price').val($(this).val().replace(/,/g, "").trim());
        });
        $('.price-basic').simpleMoneyFormat();

        AddVariants();
        colorPicker();
        PriceTemp();
        RemoveItem();
    }, 100);
});

//PriceTemp();
function PriceTemp() {
    $('.price-temp').simpleMoneyFormat();
    $(".price-temp").on("input", function () {
        var suffix = $(this).attr('name').match(/\d+/);
        $("input[name='[" + suffix + "].Price").val($(this).val().replace(/,/g, ""));
    });
}


//colorPicker function
//colorPicker();
function colorPicker() {
    $('.color-picker-wrap ul').on('click', 'li', function () {

        var self = $(this);

        if (!self.hasClass('add_new')) {

            if (!self.hasClass('active')) {

                self.siblings().removeClass('active');

                var color = rgb2hex(self.css("backgroundColor"));

                self.parents('.color-picker-wrap').children(".color-picker").val(color);

                self.addClass('active');

                if (self.parents('.color-picker-wrap').children(".color-picker").hasClass('cp-show')) {
                    self.parents('.color-picker-wrap').children('small').remove();
                    self.parents('.color-picker-wrap').prepend('<small>Màu sắc: <code>' + color + '</code></small>');
                    //self.parents('.color-picker-wrap').prepend("<input type='hidden' value = '" + color +"' />");
                    //$('#VariantValue').val(color);
                }

            }
        } else {
            //self.parents('.color-picker-wrap').children("input[type='color']").trigger('click');
        }
    });

    var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");

    function rgb2hex(rgb) {

        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }

    function hex(x) {
        return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
    }
}

$("div.label-floating").removeClass("is-empty");

// Truyền giá trị VariantValue
function SetVariantValue(id) {
    var variantName = "[" + id + "]" + ".VariantValue";
    var variantDesc = "[" + id + "]" + ".Desc";
    var divId = "#div_id_" + id + " code";

    setTimeout(function () {
        $("input[name='" + variantName + "']").val($("#div_id_" + id + " code").text());

        $("input[name='" + variantDesc + "']").val($("#div_id_" + id + " ul li.active").attr('title'));

        //console.log($("#div_id_" + id + " ul li.active").attr('title'));

    }, 100);

}


function RemoveItem() {
    $('a.remove').on("click", function (e) {
        e.preventDefault();

        if ($(this).attr('data-id') == 0) {
            return;
        } else if ($(this).attr('data-id') == count) {
            count = count - 1;
            $(this).parent().parent().parent().parent().parent().remove();
        }

    });
}


// AddVariants Button
function AddVariants() {
    $("a.color-basic-variant").click(function (e) {
        e.preventDefault();

        // +1
        count = count + 1;

        var $mainDiv = $("div.modal-body-variant");
        var $divLast = $mainDiv.find("div.variant-color-basic:last");
        var $divNew = $divLast.clone();

        //console.log($mainDiv);

        var suffix = $divNew.find(':input:first').attr('name').match(/\d+/);

        //// Set lại onclick của ul
        $.each($divNew.find('ul'), function (i, val) {
            $(this).attr("onclick", 'SetVariantValue(' + (parseInt(suffix) + 1) + ')');
        });

        $.each($divNew.find('.remove'), function (i, val) {
            $(this).attr('data-id', (parseInt(suffix) + 1));
        });

        $.each($divNew.find("div.color-picker-wrap"), function (i, val) {
            $(this).attr('id', 'div_id_' + (parseInt(suffix) + 1) + '');
        });

        // Set lại name cho input
        $.each($divNew.find(':input'), function (i, val) {
            // Replaced Name
            var oldN = $(this).attr('name');
            var newN = oldN.replace('[' + suffix + ']', '[' + (parseInt(suffix) + 1) + ']');
            $(this).attr('name', newN);

            // If you have another Type then replace with default value
            $(this).removeClass("input-validation-error");
        });
        $divLast.after($divNew);

        // Set IsEmpty cho VariantValue
        $divNew.find(".price-temp").val("");
        $divNew.find(".price-color").val("");

        // Thêm is-empty vào .div-price
        $divNew.find(".div-price").addClass("is-empty");

        // Re-assign Validation
        var form = $("form")
            .removeData("validator")
            .removeData("unobtrusiveValidation");
        $.validator.unobtrusive.parse(form);

        setTimeout(function () {
            colorPicker();
            RemoveItem();
            PriceTemp();
        }, 100);
    });
}

// formatNumber Currency
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

function SubmitVariant(form) {
    $.validator.unobtrusive.parse(form);

    if ($(form).valid()) {
        $.ajax({
            type: "POST",
            url: form.action,
            data: $(form).serialize(),
            success: function (data) {
                if (data.success) {
                    //var productId = $('#AddVariant .productId').val();

                    // Load lại Modal
                    //$("#AddVariant").load("/Admin/Product/AddVariant/@ViewBag.GetId" + " .modal-dialog");

                    // Load lại DisplayVariants
                    //$("#box-list-variants").load("/Admin/Product/DisplayVariants/@ViewBag.GetId" + " .div-list-variant");
                    $("#box-list-variants").load("/Admin/Product/DisplayVariants/" + postId + " .div-list-variant");

                    // Nếu thành công thì ẩn modal
                    $('#AddVariant').modal('hide');

                    setTimeout(function () {
                        $('.price-variant-display').text("Giá sản phẩm: " + formatNumber($('#Price').val(), ".", ","));
                    }, 100);
                }
            }
        })
    }
    return false;
}


function DeleteImage(id) {
    swal({
        title: 'Bạn muốn xóa?',
        text: "Nếu bạn đồng ý xóa, sẽ không thể lấy lại được!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy xóa'
    }).then(function () {
        $.ajax({
            type: "POST",
            url: '/Admin/Product/DeleteImage',
            data: { id: id },
            success: function (data) {
                if (data.success) {
                    //$("#box-list-images").load("/Admin/Product/DisplayImages/@ViewBag.GetId" + " .div-list-image");
                    $("#box-list-images").load("/Admin/Product/DisplayImages/" + postId + " .div-list-image");

                    setTimeout(function () {
                        AttachmentDescChanged();
                    }, 1000);
                } else {
                    jindomodal.showSwal('permission-warning');
                }
            }
        });
    }).catch(function (reason) {
        // Không xóa
    });
}

function AttachmentDescChanged() {
    var originalTextBoxValue;

    $(".li-div-left input.text-box").click(function () {
        originalTextBoxValue = $(this).val();
        $(this).attr("readonly", false);
    });


    // Stop user to press enter in textbox
    $(".li-div-left input.text-box").keypress(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });


    $(".li-div-left input.text-box").blur(function () {
        var $this = $(this);
        var ajaxdiv = $this.parent().find(".ajaxdivtd");
        var newDesc = $this.val();
        var id = $this.parent().parent().attr("id").substring(3);
        var url = "/admin/product/AttachmentDesc";

        if (newDesc.length < 5) {
            $this.val(originalTextBoxValue);
            $this.attr("readonly", true);
            return false;
        }

        $.ajax({
            type: "POST",
            url: url,
            data: { newDesc: newDesc, id: id },
            success: function (data) {
                if (data.success == true) {
                    //jindomodal.showSwal('success-edit-input');

                } else if (data.success == false) {
                    //
                } else {
                    //
                }
            }
        });
    });
}


/*
* Dropzone js: Gửi lên server id của sản phẩm vào reload lại trang khi upload thành công.
*/
Dropzone.options.dropzoneForm = {
    acceptedFiles: "image/*",
    init: function () {
        this.on("complete", function (file) {
            if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
                //$("#box-list-images").load("/Admin/Product/DisplayImages/@ViewBag.GetId" + " .ul-images");
                $("#box-list-images").load("/Admin/Product/DisplayImages/" + postId + " .ul-images");

                setTimeout(function () {
                    AttachmentDescChanged();
                }, 1000);
            }
        });

        this.on("sending", function (file, xhr, formData) {
            formData.append("id", postId);
        });
    }
};


$("#categories-list option").filter(function () {
    return $.trim($(this).text()) == ''
}).remove();

$("#categories-list").prepend("<option value='' selected='selected'></option>");
$("#BrandId").prepend("<option value='' selected='selected'></option>");
$("#GroupId").prepend("<option value='' selected='selected'></option>");
$("#SupplierId").prepend("<option value='' selected='selected'></option>");

$('#Detail').trumbowyg({
    btnsDef: {
        // Customizables dropdowns
        image: {
            dropdown: ['insertImage', 'upload', 'base64', 'noembed'],
            ico: 'insertImage'
        }
    },
    btns: [
        ['viewHTML'],
        ['undo', 'redo'],
        ['formatting'],
        ['strong', 'em', 'del', 'underline'],
        ['link'],
        ['image'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
        ['unorderedList', 'orderedList'],
        ['foreColor', 'backColor'],
        ['preformatted'],
        ['horizontalRule'],
        ['fontfamily', 'fontsize'],
        ['removeformat'],
    ],
    lang: 'vi',
    imageWidthModalEdit: true
});


$('#Detail').trumbowyg('html', '<p style="text-align: center;"><strong><br></strong></p><p style="text-align: center;"><strong><br></strong></p><p style="text-align: center;"><span style="font-size: x-large;">Nội dung, mô tả chi tiết về sản phẩm.</span>');

// END: CREATE PRODUCT
