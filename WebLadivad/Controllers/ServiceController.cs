using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebLadivad.Controllers
{
    public class ServiceController : Controller
    {
        // GET: Service
        public ActionResult Interior()
        {
            return View();
        }


        public ActionResult Exterior()
        {
            return View();
        }
    }
}