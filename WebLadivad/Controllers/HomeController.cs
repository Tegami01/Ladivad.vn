using Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebLadivad.Controllers
{
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

        public ActionResult Get4()
        {
            var model = _newsService.GetByProject1();
            return PartialView("_Get4", model);
        }
        public ActionResult Get5()
        {
            var model = _newsService.GetByProject5();
            return PartialView("_Get5", model);
        }
        public ActionResult Get9()
        {
            var model = _newsService.GetByProject9();
            return PartialView("_Get9", model);
        }
        public ActionResult Get10()
        {
            var model = _newsService.GetByProject10();
            return PartialView("_Get10", model);
        }

        public ActionResult Index()
        {
            return View();
        }
    }
}