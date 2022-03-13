
var Id = $("#Id").val();

jindokuyo = {

    initUpload: function () {
        Dropzone.autoDiscover = false;
        var myDropzone = new Dropzone("div#jindoUpload", {
            maxFiles: 50,
            parallelUploads: 1,        // Upload đồng thời
            acceptedFiles: 'image/*',
            url: '/admin/news/UploadAlbum/' + Id,
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

        $.getJSON("/admin/news/GetAttachments/" + Id).done(function (data) {
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
                    myDropzone.emit("thumbnail", mockFile, "/uploads/news/" + Id + "/" + item.FileName);

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
                url: '/Admin/news/DeleteImage',
                data: { newsId: Id, fileName: fileName, fileSize: file.size },
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
                    var url = "/Admin/news/ReorderImages";

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

function SetFeaturedImage() {
    var dataArr = new Array();

    $("#jindoUpload .dz-processing").each(function (i, val) {
        //console.log($(val).find(".dz-image img").attr("alt"));
        dataArr.push($(val).find(".dz-image img").attr("alt"));
        return i < 1;   // Chạy 2 phát thôi
    });

    $.ajax({
        type: "POST",
        url: '/Admin/News/SetFeaturedImage',
        data: {
            Id: Id,
            'dataArr': dataArr
        }
    });
}