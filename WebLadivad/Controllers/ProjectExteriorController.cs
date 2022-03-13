using Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebLadivad.Controllers
{
    public class ProjectExteriorController : Controller
    {
        IMenuService _menuService;
        IContactService _contactService;
        INewsService _newsService;
        ISliderService _sliderService;
        public ProjectExteriorController(
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
        // GET: ProjectExterior
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Bt()
        {

            return PartialView("_Bt");
        }

        public ActionResult Bt4(string tag, string project, string projecttype, int take, int skip)
        {
            var model = _newsService.GetByProjectInterior(tag, project, projecttype, take, skip);
            return PartialView("_Bt4", model);
        }
        public ActionResult Bt5(string tag, string project, string projecttype, int take, int skip)
        {

            var model = _newsService.GetByProjectInterior(tag, project, projecttype, take, skip);
            return PartialView("_Bt5", model);
        }
        public ActionResult Bt9(string tag, string project, string projecttype, int take, int skip)
        {

            var model = _newsService.GetByProjectInterior(tag, project, projecttype, take, skip);
            return PartialView("_Bt9", model);
        }
        public ActionResult Bt10(string tag, string project, string projecttype, int take, int skip)
        {

            var model = _newsService.GetByProjectInterior(tag, project, projecttype, take, skip);
            return PartialView("_Bt10", model);
        }
        //end bt
        public ActionResult Ct()
        {

            return PartialView("_Ct");
        }

        public ActionResult Ct4(string tag, string project, string projecttype, int take, int skip)
        {
            var model = _newsService.GetByProjectInterior(tag, project, projecttype, take, skip);
            return PartialView("_Ct4", model);
        }
        public ActionResult Ct5(string tag, string project, string projecttype, int take, int skip)
        {

            var model = _newsService.GetByProjectInterior(tag, project, projecttype, take, skip);
            return PartialView("_Ct5", model);
        }
        public ActionResult Ct9(string tag, string project, string projecttype, int take, int skip)
        {

            var model = _newsService.GetByProjectInterior(tag, project, projecttype, take, skip);
            return PartialView("_Ct9", model);
        }
        public ActionResult Ct10(string tag, string project, string projecttype, int take, int skip)
        {

            var model = _newsService.GetByProjectInterior(tag, project, projecttype, take, skip);
            return PartialView("_Ct10", model);
        }
        //endct

        public ActionResult Np()
        {

            return PartialView("_Np");
        }


        public ActionResult Np4(string tag, string project, string projecttype, int take, int skip)
        {
            var model = _newsService.GetByProjectInterior(tag, project, projecttype, take, skip);
            return PartialView("_Np4", model);
        }
        public ActionResult Np5(string tag, string project, string projecttype, int take, int skip)
        {

            var model = _newsService.GetByProjectInterior(tag, project, projecttype, take, skip);
            return PartialView("_Np5", model);
        }
        public ActionResult Np9(string tag, string project, string projecttype, int take, int skip)
        {

            var model = _newsService.GetByProjectInterior(tag, project, projecttype, take, skip);
            return PartialView("_Np9", model);
        }
        public ActionResult Np10(string tag, string project, string projecttype, int take, int skip)
        {

            var model = _newsService.GetByProjectInterior(tag, project, projecttype, take, skip);
            return PartialView("_Np10", model);
        }
        //endct
    }
}