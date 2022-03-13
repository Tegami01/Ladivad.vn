using Libs;
using Service.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebLadivad.Controllers
{
    public class FileController : Controller
    {
        IAttachmentService _attachmentService;
        INewsService _newsService;
        public FileController(IAttachmentService attachmentService , INewsService newsService)
        {
            _attachmentService = attachmentService;
            _newsService = newsService;
        }


        // GET: Admin/File/UploadFile
        public ActionResult Upload(HttpPostedFileBase image)
        {
            string file = "";
            string message = "";
            int status = 201;
            bool success = false;

            // Upload file
            if (image != null && image.ContentLength > 0 && JUpload.isValidContentType(image.ContentType))
            {
                if (!JUpload.isValidContentLength(image.ContentLength))
                {
                    success = false;
                    message = "File quá lớn";
                    status = 500;
                    file = null;

                    var error = new { status, file, success, message };

                    return Json(error, JsonRequestBehavior.AllowGet);
                }

                // Create necessary directories
                var currentDay = DateTime.Now.ToString("ddMMMMyyyy");
                string fileName = Path.GetFileName(image.FileName);
                string filepath = Path.Combine(Server.MapPath("~/uploads/files/"), DateTime.Now.ToString("H-mm") + "-" + fileName  );
                var pathImage = "~/uploads/files/";

                // Tạo thư mục nếu chưa có


                // Lưu ảnh
                image.SaveAs(filepath);


                file = "/uploads/files/" + DateTime.Now.ToString("H-mm") + "-" + fileName;
                status = 200;
                success = true;
                message = "Upload thành công!";
            }


            var data = new { status, file, success, message };

            return Json(data, JsonRequestBehavior.AllowGet);
        }
    }
}