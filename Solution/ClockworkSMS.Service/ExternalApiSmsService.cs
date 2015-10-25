using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Common;
using Newtonsoft.Json.Linq;
using RestSharp;

namespace ClockworkSMS.Service
{
    public class ExternalApiSmsService : IExternalApiSmsService
    {
        private static ExternalApiSmsService _instance;
        private int _millisecondsTimeout;

				private Dictionary<string, SMS> SmsCache { get; set; } 

        public static ExternalApiSmsService Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new ExternalApiSmsService();
                }
                return _instance;
            }
        }

        private ExternalApiSmsService()
        {
            SmsCache = new Dictionary<string, SMS>();
        }

        public void Start()
        {
            var task = Task.Factory.StartNew(() =>
            {
                while (true)
                {
                    try
                    {
                        QueryExternalApi();
                    }
                    catch (Exception e)
                    {
                        Logger.Log(e);
                    }
                    

                    _millisecondsTimeout = 1000;
                    Thread.Sleep(_millisecondsTimeout);
                }
                
            });
        }

        private void QueryExternalApi()
        {
            var mClient = new RestClient("https://mayhem-clockwork.herokuapp.com");

            var req = new RestRequest
            {
                Resource = "/",
                Method = Method.GET
            };

            var resp = mClient.Execute(req);

            var content = resp.Content;

            var smsListJsonTokens = JArray.Parse(content);

            if (!smsListJsonTokens.Any()) return;

            foreach (var smsJsonToken in smsListJsonTokens)
            {
                var sms = new SMS() { FromNumber = (string)smsJsonToken.SelectToken("from"), ID = (string)smsJsonToken.SelectToken("id"), Text = (string)smsJsonToken.SelectToken("content"), Timestamp = (string)smsJsonToken.SelectToken("timestamp") };
                sms.Hash = ("" + sms.Timestamp + sms.Text + sms.FromNumber).ComputeHash(Hasher.eHashType.SHA1);
                if (!SmsCache.ContainsKey(sms.Hash))
                {
                    SmsCache.Add(sms.Hash, sms);
                }
            }

            Publish.Invoke();
        }

        public Dictionary<string, SMS> GetAllSms()
        {
            return SmsCache;
        }

        public event Action Publish;

    }

    public interface IExternalApiSmsService : IService
    {
        Dictionary<string, SMS> GetAllSms();
    }
}
