using Libs;
using Model;
using Model.DataModel;
using PagedList;
using Service.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebLadivad.Areas.Admin.Controllers
{

    [Authorize]
    public class NewsController : Controller
    {
        protected LadivadDbContext db = new LadivadDbContext();

        INewsService _newsService;
        IAttachmentService _attachmentService;

        public NewsController(INewsService newsService, IAttachmentService attachmentService)
        {
            _newsService = newsService;

            _attachmentService = attachmentService;
        }


        // GET: Admin/News
        public ActionResult Index(int? page, string keyword)
        {
            int pageNumber = (page ?? 1);
            int pageSize = 5;
            var model = _newsService.GetAll(keyword);

            return View("Index", model.ToPagedList(pageNumber, pageSize));
        }


        [HttpGet]
        public ActionResult Create()
        {

            return View();
        }


        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        [ValidateInput(false)]
        public ActionResult Create(NewsDTO model, HttpPostedFileBase imgMain, HttpPostedFileBase imgTop)
        {

            NewsDTO news = new NewsDTO();
            model.ImgMain = imgMain.FileName;
            model.Imgs = imgTop.FileName;

            if (!ModelState.IsValid)
            {
               return View(model);
            }
            // Declare product id
            int id;
            news.HotNews = false;
            news.Status = false;
            news.Desc = model.Desc;
            news.Detail = null;
            news.Title = model.Title;
            news.View = 0;
            news.Url = model.Url;
            news.Tags = model.Tags;
            news.ImgMain = imgMain.FileName;
            news.Imgs = imgTop.FileName;
            news.CreatedDate = DateTime.Now;

            
            _newsService.Add(news);
            _newsService.Save();
            id = news.Id;
            if (imgMain != null && imgMain.ContentLength > 0 && JUpload.isValidContentType(imgMain.ContentType))
            {
                if (!JUpload.isValidContentLength(imgMain.ContentLength))
                {
                    ViewBag.Error = "Your file is too large.";
                    return View();
                }

                string fileName = Path.GetFileName("imgMain" + id.ToString() + "-" + imgMain.FileName);
                string filepath = Path.Combine(Server.MapPath("~/uploads/news"), fileName);
                imgMain.SaveAs(filepath);

                NewsDTO dto = _newsService.GetbyId(id);
                dto.ImgMain = "imgMain" + id.ToString() + "-" + imgMain.FileName;
            }
            //top img
            if (imgTop != null && imgTop.ContentLength > 0 && JUpload.isValidContentType(imgTop.ContentType))
            {
                if (!JUpload.isValidContentLength(imgTop.ContentLength))
                {
                    ViewBag.Error = "Your file is too large.";
                    return View();
                }

                string fileName = Path.GetFileName("imgTop" + id.ToString() + "-" + imgTop.FileName);
                string filepath = Path.Combine(Server.MapPath("~/uploads/news"), fileName);
                imgTop.SaveAs(filepath);

                NewsDTO dto = _newsService.GetbyId(id);
                dto.Imgs = "imgTop" + id.ToString() + "-" + imgTop.FileName;
            }


            _newsService.Save();
            
            
            return RedirectToAction("Edit", new { id = id });
        }



        public ActionResult GetAttachments(int id)
        {
            var att = _attachmentService.GetById(id, "news");

            return Json(new { Data = att }, JsonRequestBehavior.AllowGet);
        }




        [HttpGet]
        public ActionResult Edit(int id)
        {
            NewsDTO model = _newsService.GetbyId(id);

            return View(model);
        }
        [HttpPost]
        public ActionResult Edit(NewsDTO model, HttpPostedFileBase file , HttpPostedFileBase imgMain, HttpPostedFileBase imgTop)
        {
            var news = _newsService.GetbyId(model.Id);

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            int id;
            id = news.Id;
            if (news.Tags == "News")
            {
                if(model.Detail == null)
                {
                    news.HotNews = model.HotNews;
                    news.Status = false;
                    news.Desc = model.Desc;
                    news.Detail = null;
                    news.Title = model.Title;
                    news.Url = model.Url;
                    news.Tags = news.Tags;
                    if (imgMain == null && imgTop != null)
                    {
                        news.ImgMain = news.ImgMain;
                        news.Imgs = imgTop.FileName;
                    }
                    else if(imgTop == null && imgMain != null)
                    {
                        news.ImgMain = imgMain.FileName;
                        news.Imgs = news.Imgs;
                    }
                    else if (imgMain == null && imgMain == null)
                    {
                        news.ImgMain = news.ImgMain;
                        news.Imgs = news.Imgs;
                    }
                    else
                    {
                        model.ImgMain = imgMain.FileName;
                        model.Imgs = imgTop.FileName;
                    }
                }
                else
                {
                    news.HotNews = model.HotNews;
                    news.Status = true;
                    news.Desc = model.Desc;
                    news.Detail = model.Detail;
                    news.Title = model.Title;
                    news.Url = model.Url;
                    news.Tags = news.Tags;
                    if (imgMain == null && imgTop != null)
                    {
                        news.ImgMain = news.ImgMain;
                        news.Imgs = imgTop.FileName;
                    }
                    else if (imgTop == null && imgMain != null)
                    {
                        news.ImgMain = imgMain.FileName;
                        news.Imgs = news.Imgs;
                    }
                    else if (imgMain == null && imgMain == null)
                    {
                        news.ImgMain = news.ImgMain;
                        news.Imgs = news.Imgs;
                    }
                    else
                    {
                        model.ImgMain = imgMain.FileName;
                        model.Imgs = imgTop.FileName;
                    }
                }
            }

            if (news.Tags == "Project")
            {
                if (model.ProjectType == null && model.Project == null)
                {
                    news.HotNews = model.HotNews;
                    news.Status = false;
                    news.Desc = model.Desc;
                    news.Detail = null;
                    news.ProjectType = model.ProjectType;
                    news.Project = model.Project;
                    news.Title = model.Title;
                    news.Url = model.Url;
                    news.Tags = news.Tags;
                    if (imgMain == null && imgTop != null)
                    {
                        news.ImgMain = news.ImgMain;
                        news.Imgs = imgTop.FileName;
                    }
                    else if (imgTop == null && imgMain != null)
                    {
                        news.ImgMain = imgMain.FileName;
                        news.Imgs = news.Imgs;
                    }
                    else if (imgMain == null && imgMain == null)
                    {
                        news.ImgMain = news.ImgMain;
                        news.Imgs = news.Imgs;
                    }
                    else
                    {
                        model.ImgMain = imgMain.FileName;
                        model.Imgs = imgTop.FileName;
                    }
                }
                else if(model.ProjectType == null || model.Project == null)
                {
                    news.HotNews = model.HotNews;
                    news.Status = false;
                    news.Desc = model.Desc;
                    news.Detail = null;
                    news.ProjectType = model.ProjectType;
                    news.Project = model.Project;
                    news.Title = model.Title;
                    news.Url = model.Url;
                    news.Tags = news.Tags;
                    if (imgMain == null && imgTop != null)
                    {
                        news.ImgMain = news.ImgMain;
                        news.Imgs = imgTop.FileName;
                    }
                    else if (imgTop == null && imgMain != null)
                    {
                        news.ImgMain = imgMain.FileName;
                        news.Imgs = news.Imgs;
                    }
                    else if (imgMain == null && imgMain == null)
                    {
                        news.ImgMain = news.ImgMain;
                        news.Imgs = news.Imgs;
                    }
                    else
                    {
                        model.ImgMain = imgMain.FileName;
                        model.Imgs = imgTop.FileName;
                    }
                }
                else
                {
                    news.HotNews = model.HotNews;
                    news.Status = true;
                    news.ProjectType = model.ProjectType;
                    news.Desc = model.Desc;
                    news.Project = model.Project;
                    news.Detail = model.Detail;
                    news.Title = model.Title;
                    news.Url = model.Url;
                    news.Tags = news.Tags;
                    if (imgMain == null && imgTop != null)
                    {
                        news.ImgMain = news.ImgMain;
                        news.Imgs = imgTop.FileName;
                    }
                    else if (imgTop == null && imgMain != null)
                    {
                        news.ImgMain = imgMain.FileName;
                        news.Imgs = news.Imgs;
                    }
                    else if (imgMain == null && imgMain == null)
                    {
                        news.ImgMain = news.ImgMain;
                        news.Imgs = news.Imgs;
                    }
                    else
                    {
                        model.ImgMain = imgMain.FileName;
                        model.Imgs = imgTop.FileName;
                    }
                }
            }
            // Declare product id

            if (imgMain != null && imgMain.ContentLength > 0 && JUpload.isValidContentType(imgMain.ContentType))
            {
                if (!JUpload.isValidContentLength(imgMain.ContentLength))
                {
                    ViewBag.Error = "Your file is too large.";
                    return View();
                }

                string fileName = Path.GetFileName("imgMain" + id.ToString() + "-" + imgMain.FileName);
                string filepath = Path.Combine(Server.MapPath("~/uploads/news"), fileName);
                imgMain.SaveAs(filepath);

                NewsDTO dto = _newsService.GetbyId(id);
                dto.ImgMain = "imgMain" + id.ToString() + "-" + imgMain.FileName;
            }
            //top img
            if (imgTop != null && imgTop.ContentLength > 0 && JUpload.isValidContentType(imgTop.ContentType))
            {
                if (!JUpload.isValidContentLength(imgTop.ContentLength))
                {
                    ViewBag.Error = "Your file is too large.";
                    return View();
                }

                string fileName = Path.GetFileName("imgTop" + id.ToString() + "-" + imgTop.FileName);
                string filepath = Path.Combine(Server.MapPath("~/uploads/news"), fileName);
                imgTop.SaveAs(filepath);

                NewsDTO dto = _newsService.GetbyId(id);
                dto.Imgs = "imgTop" + id.ToString() + "-" + imgTop.FileName;
            }


            _newsService.Update(news);
            _newsService.Save();

            if(news.Tags == "News")
            {
                if (news.Detail != null)
                {
                    TempData["Message"] = "Chỉnh sửa thành công !!! ";

                    return RedirectToAction("Edit", new { id = id });
                }
                TempData["Message"] = "Vui lòng nhập chi tiết bài viết để hoàn thành bài viết !!! ";
            }


            if (news.Tags == "Project")
            {
                if (news.ProjectType != null && news.Project != null)
                {
                    TempData["Message"] = "Chỉnh sửa thành công !!! ";

                    return RedirectToAction("Edit", new { id = id });
                }
                TempData["Message"] = "Vui lòng chọn kiểu dự án hoặc định dạng dự án để hoàn thành bài viết !!! ";
            }

            return RedirectToAction("Edit", new { id = id });
        }


        public void CreateDirectory(int id)
        {
            // Create necessary directories
            var originalDirectory = new DirectoryInfo(string.Format("{0}uploads", Server.MapPath(@"\")));

            var pathString = Path.Combine(originalDirectory.ToString(), "news");
            var pathString2 = Path.Combine(originalDirectory.ToString(), "news\\" + id.ToString());

            if (!Directory.Exists(pathString))
                Directory.CreateDirectory(pathString);

            if (!Directory.Exists(pathString2))
                Directory.CreateDirectory(pathString2);
        }



        [HttpPost]
        public ActionResult UploadAlbum(int id)
        {
            // Tạo thư mục theo Id để upload ảnh sản phẩm
            CreateDirectory(id);

            // Lấy slug của sản phẩm


            AttachmentDTO att = new AttachmentDTO();

            long attId = 0;
            string altString = "";

            foreach (string fileName in Request.Files)
            {
                HttpPostedFileBase file = Request.Files[fileName];
                int fileSize = file.ContentLength;

                if (file != null && file.ContentLength > 0)
                {
                    string ext = file.ContentType.ToLower();

                    if (ext != "image/jpg" &&
                        ext != "image/jpeg" &&
                        ext != "image/pjpeg" &&
                        ext != "image/gif" &&
                        ext != "image/x-png" &&
                        ext != "image/png")
                    {
                        return Json(new { success = false, message = "Định dạng không được hỗ trợ." }, JsonRequestBehavior.AllowGet);
                    }

                    var originalDirectory = new DirectoryInfo(string.Format("{0}Uploads", Server.MapPath(@"\")));
                    string pathString = Path.Combine(originalDirectory.ToString(), "news\\" + id.ToString());
                    string extension = Path.GetExtension(file.FileName);

                    // Rename file Upload
                    string random = JString.RandomString(3).ToLower();
                    string fileNameChanged =   random + extension;
                    file.SaveAs(Path.Combine(pathString, fileNameChanged));
                    var pathurl = Path.GetFileName(fileNameChanged).ToString();
                    altString = fileNameChanged;


                    if (db.Attachment.Any(x => x.NewsId == id && x.FileName == pathurl))
                    {
                        return Json(new { success = false });
                    }

                    att.FileName = Path.GetFileName(fileNameChanged);
                    att.NewsId = id;
                    att.DataType = "news";
                    att.FileSize = fileSize;
                }

                db.Attachment.Add(att);
                db.SaveChanges();

                attId = att.AttachmentId;
            }

            var data = new { attId, altString };


            return Json(data, JsonRequestBehavior.AllowGet);
        }


        // POST: /Admin/News/ReorderImages
        [HttpPost]
        public void ReorderImages(int[] id)
        {
            // Set initial count
            int count = 1;

            AttachmentDTO att;

            // Set sorting for each pages
            foreach (var pageId in id)
            {
                att = db.Attachment.Find(pageId);
                att.Sorting = count;

                db.SaveChanges();

                count++;
            }
        }


        public ActionResult DeleteImage(long newsId, string fileName, int fileSize)
        {
            // Get the category
            AttachmentDTO att = db.Attachment.Where(x => x.NewsId == newsId && x.FileName == fileName && x.FileSize == fileSize).FirstOrDefault();

            // Remove the page
            try
            {
                db.Attachment.Remove(att);
                //_attachmentService.Delete(att);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Xóa trong databse không thành công.", errCode = ex.ToString() }, JsonRequestBehavior.AllowGet);
            }

            // Save
            db.SaveChanges();

            // Delete File
            string galleryPath = Server.MapPath(@"~/uploads/news/" + newsId + "/" + att.FileName);

            if (System.IO.File.Exists(galleryPath))
                System.IO.File.Delete(galleryPath);

            return Json(new { success = true, message = "Xóa trong databse thành công." }, JsonRequestBehavior.AllowGet);
        }



        [HttpGet]
        public ActionResult Delete(int id)
        {
            var model = _newsService.GetbyId(id);

            return PartialView("_Delete", model);
        }

        [HttpPost]
        public ActionResult Delete(MenuDTO model)
        {
            _newsService.Delete(model.Id);
            _newsService.Save();

            return RedirectToAction("Index");
        }


        [HttpGet]
        public ActionResult HotNews()
        {
            var model = _newsService.GetByHotNews();

            return View(model);
        }
    }
}