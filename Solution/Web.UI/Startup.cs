using Microsoft.Owin;
using Owin;
using Web.UI;

[assembly: OwinStartup(typeof(Startup))]
namespace Web.UI
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Any connection or hub wire up and configuration should go here
            app.MapSignalR();
        }
    }
}