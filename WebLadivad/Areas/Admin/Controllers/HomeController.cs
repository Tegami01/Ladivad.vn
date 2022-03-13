using Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebLadivad.Areas.Admin.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        IMenuService _menuService;
        IContactService _contactService;
        INewsService _newsService;
        ISliderService _sliderService;
        public HomeController(
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
        // GET: Admin/Home
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult GetNewsView()
        {
            var model = _newsService.GetByViewNews();
            return PartialView("_GetNewsView",model);
        }


        public ActionResult GetProjectView()
        {
            var model = _newsService.GetByViewProject();
            return PartialView("_GetProjectView",model);
        }
    }
}