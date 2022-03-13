using Model.DataModel;
using Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebLadivad.Controllers
{
    public class PartialController : Controller
    {
        IMenuService _menuService;
        IContactService _contactService;
        INewsService _newsService;
        ISliderService _sliderService;
        public PartialController(
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
        [HttpGet]
        public ActionResult _Nav()
        {
            var model = _menuService.GetAll();
            return PartialView("_Nav", model);
        }

        [HttpGet]
        public ActionResult _Slider()
        {
            var model = _sliderService.GetAll();
            return PartialView("_Slider", model);
        }


        [HttpGet]
        public ActionResult _Search(string keyword)
        {
            var model = _newsService.GetAlls(keyword);
            return PartialView("_Search", model);
        }

        [HttpPost]
        public ActionResult _Search(string keyword , int post)
        {
            var model = _newsService.GetAlls(keyword);
            return PartialView("_Search", model);
        }

        [HttpPost]
        public ActionResult _Nav(MenuDTO dto)
        {
            var model = _menuService.GetAll();
            return PartialView("_Nav", model);
        }

        [HttpGet]
        public ActionResult _NavItem(int id)
        {
            var model = _menuService.GetByParentId(id);
            return PartialView("_Nav", model);
        }

        [HttpGet]
        public ActionResult _NavMb()
        {
            var model = _menuService.GetAll();
            return PartialView("_NavMb", model);
        }

        [HttpPost]
        public ActionResult _NavMb(MenuDTO dto)
        {
            var model = _menuService.GetAll();
            return PartialView("_NavMb", model);
        }
    }
}