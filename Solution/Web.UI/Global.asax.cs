using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using ClockworkSMS.Service;
using Common;

namespace Web.UI
{
	public class MvcApplication : System.Web.HttpApplication
	{
		protected void Application_Start()
		{
			AreaRegistration.RegisterAllAreas();
			RouteConfig.RegisterRoutes(RouteTable.Routes);
		    Bootstrap.Setup();
		}
	}

    public class Bootstrap
    {
        public static void Setup()
        {
            Credentials.Init(LocalConfigs.ConsumerKey, LocalConfigs.SecretKey, LocalConfigs.AutodeskBaseUrl);
            var smsService = ExternalApiSmsService.Instance;
            smsService.Start();
        }
    }
}
