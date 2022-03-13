using PagedList;
using Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebLadivad.Areas.Admin.Controllers
{
    [Authorize]
    public class ContactController : Controller
    {

        IMenuService _menuService;
        IContactService _contactService;
        INewsService _newsService;
        ISliderService _sliderService;
        public ContactController(
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

        // GET: Admin/Contact
        public ActionResult Index(int? page, string keyword)
        {
            int pageNumber = (page ?? 1);
            int pageSize = 10;
            var model = _contactService.GetAll(keyword);
            return View("Index", model.ToPagedList(pageNumber, pageSize));
        }

        public ActionResult Edit(int id)
        {
            var model = _contactService.GetById(id);
            return View(model); 
        }

    }
}