using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(WebLadivad.App_Start.Startup))]
namespace WebLadivad.App_Start
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            ConfigureIoC(app);
        }
    }
}