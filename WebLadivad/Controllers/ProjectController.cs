using Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebLadivad.Controllers
{
    public class ProjectController : Controller
    {
        IMenuService _menuService;
        IAttachmentService _attachmentService;
        IContactService _contactService;
        INewsService _newsService;
        ISliderService _sliderService;
        public ProjectController(
        IMenuService menuService,
        IContactService contactService,
        INewsService newsService,
        ISliderService sliderService,
        IAttachmentService attachmentService
            )
        {
            _attachmentService = attachmentService;
            _menuService = menuService;
            _contactService = contactService;
            _newsService = newsService;
            _sliderService = sliderService;
        }

        // GET: Project
        public ActionResult Index(string keyword)
        {
            var model = _newsService.GetAlls(keyword);
            return View(model);
        }

        public ActionResult Details( string url)
        {
            var model = _newsService.GetByUrl(url);

            model.View++;

            _newsService.Update(model);
            _newsService.Save();

            return View(model);
        }

        public ActionResult Thumbs(long id)
        {
            var att = _attachmentService.GetById(id, "news");
            return PartialView("_Thumbs", att);
        }

        public ActionResult SilderFooter(string keyword)
        {
            var model = _newsService.GetAlls(keyword);
            return PartialView("_SilderFooter", model);
        }
    }
}