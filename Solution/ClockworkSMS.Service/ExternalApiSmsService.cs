using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Common;

namespace ClockworkSMS.Service
{
    public class ExternalApiSmsService : IExternalApiSmsService
    {
        private static ExternalApiSmsService _instance;
        private int _millisecondsTimeout;

        private List<SMS> SMSCache { get; set; } 

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
            SMSCache = new List<SMS>();
        }

        public void Start()
        {
            var task = Task.Factory.StartNew(() =>
            {
                while (true)
                {
                    QueryExternalApi();

                    _millisecondsTimeout = 1000;
                    Thread.Sleep(_millisecondsTimeout);
                }
                
            });
        }

        private void QueryExternalApi()
        {
            //query the node heroki app

            //SMSCache = ^
        }

        public List<SMS> GetAllSms()
        {
            return SMSCache;
        }
    }

    public interface IExternalApiSmsService : IService
    {
        List<SMS> GetAllSms();
    }
}
