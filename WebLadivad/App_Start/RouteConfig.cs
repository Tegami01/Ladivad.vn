using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace WebLadivad.App_Start
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");




            // Chi tiết tin tức
            routes.MapRoute(
                name: "News",
                url: "{controller}/{action}/{url}",
                defaults: new { controller = "News", action = "Details", id = UrlParameter.Optional },
                namespaces: new[] { "WebLadivad.Controllers" }
            );

            // Default
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                namespaces: new[] { "WebLadivad.Controllers" }
            );




            routes.MapRoute(
                name: "404",
                url: "{*url}",
                defaults: new { controller = "Home", action = "NotFound", id = UrlParameter.Optional },
                namespaces: new[] { "WebLadivad.Controllers" }
            );


            routes.MapRoute("Error", "{*url}",
                new { controller = "Home", action = "NotFound", id = UrlParameter.Optional },
                new[] { "WebLadivad.Controllers" }
            );
        }
    }
}