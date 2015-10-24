using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public static class Credentials
    {
        public static string ConsumerKey;
        public static string SecretKey;
        public static string AutodeskBaseUrl;

        public static void Init(string consumerKey, string secretKey, string autodeskBaseUrl)
        {
            ConsumerKey = consumerKey;
            SecretKey = secretKey;
            AutodeskBaseUrl = autodeskBaseUrl;
        }
    }
}
