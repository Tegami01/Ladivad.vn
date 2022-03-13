using Model.DataModel;
using Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebLadivad.Controllers
{
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
        // GET: Contact
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        [ValidateInput(false)]
        public ActionResult Index(ContactDTO model)
        {
            var contact = new ContactDTO();

            if (!ModelState.IsValid)
            {
                return View("Index" ,model);
            }
            contact.FullName = model.FullName;
            contact.Email = model.Email;
            contact.PhoneNumber = model.PhoneNumber;
            contact.Address = model.Address;
            contact.Note = model.Note;
            contact.Now = DateTime.Now;
            contact.project1 = model.project1;
            contact.project2 = model.project2;
            contact.project3 = model.project3;
            contact.service1 = model.service1;
            contact.service2 = model.service2;
            contact.service3 = model.service3;

            _contactService.Add(contact);

            _contactService.Save();

            TempData["Message"] = "Đã giửi yêu cầu thành công đợi chúng tôi liên hệ !!!";


            return View("Index", model);
        }
    }
}