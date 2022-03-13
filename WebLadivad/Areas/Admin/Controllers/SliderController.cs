using Libs;
using Model.DataModel;
using PagedList;
using Service.Repositories;
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
    public class SliderController : Controller
    {

        IMenuService _menuService;
        IContactService _contactService;
        INewsService _newsService;
        ISliderService _sliderService;
        public SliderController(
        IMenuService menuService,
        IContactService contactService,
        INewsService newsService,
        ISliderService sliderService
            )
        {
            _menuService = menuService;
            _contactService = contactService;
            _newsService = newsService;
            _sliderService = sliderService;
        }
        // GET: Admin/Slider
        public ActionResult Index(int? page)
        {
            int pageNumber = (page ?? 1);
            int pageSize = 5;
            var model = _sliderService.GetAll();

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
        public ActionResult Create(SliderDTO model, HttpPostedFileBase file)
        {
            int id;
            var newsilder = new SliderDTO();


            newsilder.Img = file.FileName;
            if (newsilder.Url == null)
            {
                newsilder.Url = "";
            }
            else
            {
                newsilder.Url = model.Url;
            }
            newsilder.Status = true;

            _sliderService.Add(newsilder);
            _sliderService.Save();
            id = newsilder.Id;
            if (file != null && file.ContentLength > 0 && JUpload.isValidContentType(file.ContentType))
            {
                if (!JUpload.isValidContentLength(file.ContentLength))
                {
                    ViewBag.Error = "Your file is too large.";
                    return View();
                }

                string fileName = Path.GetFileName("id" + id.ToString() + "-" + file.FileName);
                string filepath = Path.Combine(Server.MapPath("~/uploads/slides"), fileName);
                file.SaveAs(filepath);

                SliderDTO dto = _sliderService.GetbyId(id);
                dto.Img = "id" + id.ToString() + "-" + file.FileName;
            }

            _sliderService.Save();
            return RedirectToAction("Edit", new { id = id });
        }

        [HttpGet]
        public ActionResult Edit(int id)
        {
            var model = _sliderService.GetbyId(id);
            return View(model);
        }

        [HttpPost]
        public ActionResult Edit(SliderDTO model, HttpPostedFileBase file)
        {
            int id;
            var slider = _sliderService.GetbyId(model.Id);
            if (file == null)
            {
                slider.Img = slider.Img;
            }
            else slider.Img = file.FileName;
            if (slider.Url == null)
            {
                slider.Url = "";
            }
            else
            {
                slider.Url = model.Url;
            }
            slider.Status = true;

            _sliderService.Update(slider);
            
            id = slider.Id;
            if (file != null && file.ContentLength > 0 && JUpload.isValidContentType(file.ContentType))
            {
                if (!JUpload.isValidContentLength(file.ContentLength))
                {
                    ViewBag.Error = "Your file is too large.";
                    return View();
                }

                string fileName = Path.GetFileName("id" + id.ToString() + "-" + file.FileName);
                string filepath = Path.Combine(Server.MapPath("~/uploads/slides"), fileName);
                file.SaveAs(filepath);

                SliderDTO dto = _sliderService.GetbyId(id);
                dto.Img = "id" + id.ToString() + "-" + file.FileName;
            }

            _sliderService.Save();
            TempData["Message"] = "Đã chỉnh sửa thành công !!! ";
            return RedirectToAction("Edit", new { id = id });
        }


        [HttpGet]
        public ActionResult Delete(int id)
        {
            var model = _sliderService.GetbyId(id);

            return PartialView("_Delete", model);
        }

        [HttpPost]
        public ActionResult Delete(MenuDTO model)
        {
            _sliderService.Delete(model.Id);
            _sliderService.Save();
            return RedirectToAction("Index");
        }

    }


}