using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebLadivad.Areas.Admin.Controllers
{
    public class PartialController : Controller
    {
        // GET: Admin/Partial
        public ActionResult LoginPartial()
        {
            return PartialView("_LoginPartial");
        }
    }
}