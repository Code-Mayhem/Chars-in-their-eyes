using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common;
using RestSharp;

namespace AutoDesk.Service
{
    public class AccessTokenRetriever
    {
        public string GetAccessToken()
        {
            var mClient = new RestClient(Credentials.AutodeskBaseUrl);

            var req = new RestRequest
            {
                Resource = "authentication/v1/authenticate",
                Method = Method.POST
            };

            req.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            req.AddParameter("client_id", Credentials.ConsumerKey);
            req.AddParameter("client_secret", Credentials.SecretKey);
            req.AddParameter("grant_type", "client_credentials");

            var resp = mClient.Execute(req);

            var accessToken = resp.StatusCode == System.Net.HttpStatusCode.OK ? resp.Content : null;

            return accessToken;
        }
    }
}
