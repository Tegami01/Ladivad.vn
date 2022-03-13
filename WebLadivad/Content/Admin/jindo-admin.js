jindomodal = {
    showSwal: function (type, id) {
        if (type == 'permission-warning') {
            swal({
                title: "Tài khoản của bạn không được cấp quyền để thực hiện thao tác này.",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-success"
            });
        } else if (type == 'not-allowed-delete') {
            swal({
                title: "Bạn không được phép xóa thành viên này. @@",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-success"
            });
        }
        else if (type == 'category-delete-warning') {
            swal({
                title: "Không thể chọn chính nó, vui lòng chọn lại danh mục cha. @@",
                buttonsStyling: false,
                confirmButtonText: 'Đồng ý',
                confirmButtonClass: "btn btn-success"
            });
        }
        else if (type == 'success-edit-input') {
            swal({
                title: "Thông báo",
                text: "Sửa thành công.",
                timer: 1500,
                showConfirmButton: false
            });
        }
        else if (type == 'not-allowed-delete-group') {
            swal({
                title: "Bạn không được phép xóa nhóm này. @@",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-success"
            });
        }
        else if (type == 'addproduct-success-message') {
            swal({
                title: "Chúc mừng bạn.",
                text: "Thêm thành công 1 sản phẩm!",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-success",
                confirmButtonText: 'Đồng ý',
                type: "success"
            });
        } else if (type == 'addcategory-success-message') {
            swal({
                title: "Chúc mừng bạn.",
                text: "Thao tác thành công...",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-success",
                confirmButtonText: 'Đồng ý',
                type: "success"
            });
        } else if (type == 'deletecategory-message') {       // Xóa category
            var temp = '#id_' + id;
            var catName = $(String(temp)).text().trim();
            catName = catName.replace(/close/g, '').replace(/edit/g, '').replace(/Kích hoạt/g, '').replace(/<br>/g, '').replace(/  /g, '');

            swal({
                title: 'Xóa chuyên mục ' + catName,
                text: 'Bạn có muốn tiếp tục hành động này ???',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Đồng ý',
                cancelButtonText: 'Không',
                confirmButtonClass: "btn btn-success",
                cancelButtonClass: "btn btn-danger",
                buttonsStyling: false
            }).then(function () {
                swal({
                    title: 'Xóa thành công!',
                    text: 'Xóa thành công ' + catName,
                    type: 'success',
                    confirmButtonClass: "btn btn-success",
                    buttonsStyling: false
                });

                //console.log(catName);

                DeleteCategory(id);
                AddForm();
            }, function (dismiss) {
                // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
                if (dismiss === 'cancel') {
                    swal({
                        title: 'Hủy xóa',
                        text: 'Bạn vừa hủy thao tác xóa thành công :)',
                        type: 'error',
                        confirmButtonClass: "btn btn-info",
                        buttonsStyling: false
                    })
                }
            })

            // Xóa br ở thẻ h2, .swal2-content
            $('h2 br').remove();
            $('.swal2-content br').remove();

        }
    }
}