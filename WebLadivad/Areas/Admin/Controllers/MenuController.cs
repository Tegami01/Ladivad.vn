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
    public class MenuController : Controller
    {
        IMenuService _menuService;
        IContactService _contactService;
        INewsService _newsService;
        ISliderService _sliderService;
        public MenuController(
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


        // GET: Admin/Menu
        [HttpGet]
        public ActionResult Index(int? page, string keyword)
        {
            int pageNumber = (page ?? 1);
            int pageSize = 5;
            var model = _menuService.GetAllOr(keyword);

            return View("Index", model.ToPagedList(pageNumber, pageSize));
        }

        [HttpGet]
        public ActionResult Create()
        {
            return View();
        }

        [HttpGet]
        public ActionResult LoadCategory()
        {
            var model = _menuService.GetAllParent();
            return PartialView(model);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        [ValidateInput(false)]
        public ActionResult Create(MenuDTO menu)
        {
            int? id;

            var newMenu = new MenuDTO();

            ViewBag.ParentId = _menuService.SelectList();

            if (!ModelState.IsValid)
            {
                return View(menu);
            }

            newMenu.Name = menu.Name;
            newMenu.Url = menu.Url;
            newMenu.ParentId = menu.ParentId;
            _menuService.Add(newMenu);
            _menuService.Save();
            if(newMenu.ParentId == null)
            {
                id = newMenu.Id;
            }
            else id = newMenu.ParentId;

            TempData["Message"] = "Thêm mới thành công !!! ";

            return RedirectToAction("Edit", new { id = id });
            //return View(menu);
        }

        [HttpGet]
        public ActionResult Edit(int id)
        {
            var model = _menuService.GetbyId(id);

            return View(model);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        public ActionResult Edit(MenuDTO model)
        {
            var menu = _menuService.GetbyId(model.Id);
            int? id;

            if (!ModelState.IsValid)
            {
                return View(menu);
            }

            menu.Name = model.Name;
            menu.Url = model.Url;
            menu.ParentId = menu.ParentId;

            _menuService.Update(menu);
            _menuService.Save();
            if (menu.ParentId == null)
            {
                id = menu.Id;
            }
            else id = menu.ParentId;
            TempData["Message"] = "Đã chỉnh sửa thành công !!! ";

            return RedirectToAction("Edit", new {id = id});
        }


        [HttpGet]
        public ActionResult Delete(int id)
        {
            var model = _menuService.GetbyId(id);

            return PartialView("_Delete", model);
        }

        [HttpPost]
        public ActionResult Delete(MenuDTO model)
        {
            _menuService.Delete(model.Id);
            _menuService.Save();

            return RedirectToAction("Index");
        }

        [HttpGet]
        public ActionResult _ParentMenu()
        {
            var model = _menuService.GetAllParent();
            return PartialView("_ParentMenu", model);
        }

        [HttpPost]
        public ActionResult _ParentMenu(MenuDTO dto)
        {
            var model = _menuService.GetAllParent();
            return PartialView("_ParentMenu", model);
        }
        [HttpGet]
        public ActionResult _ParentList(int id)
        {
            var model = _menuService.GetByParentId(id);
            return PartialView("_ParentList", model);
        }
    }
}