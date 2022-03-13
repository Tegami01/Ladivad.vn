using Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebLadivad.Controllers
{
    public class NewsController : Controller
    {
        IMenuService _menuService;
        IContactService _contactService;
        INewsService _newsService;
        ISliderService _sliderService;
        public NewsController(
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
        // GET: News
        public ActionResult Index()
        {
            var model = _newsService.GetByNews();
            return View(model);
        }


        public ActionResult HotNews()
        {
            var model = _newsService.GetByHotNews();
            return PartialView("_HotNews", model);
        }


        public ActionResult Details(string url)
        {
            var model = _newsService.GetByUrl(url);
            model.View++;

            _newsService.Update(model);
            _newsService.Save();

            return View(model);
        }
    }
}