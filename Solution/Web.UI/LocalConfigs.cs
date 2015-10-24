using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace Web.UI
{
    public static class LocalConfigs
    {
        public static string ConsumerKey = ConfigurationManager.AppSettings["consumerKey"];
        public static string SecretKey = ConfigurationManager.AppSettings["secretKey"];
        public static string AutodeskBaseUrl = ConfigurationManager.AppSettings["autodeskBaseUrl"];
    }
}