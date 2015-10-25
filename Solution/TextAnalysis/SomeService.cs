using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ClockworkSMS.Service;
using Common;

namespace TextAnalysis
{
    public class SomeService : IService
    {
        private static SomeService _instance;
        public static SomeService Instance {
            get { return _instance ?? (_instance = new SomeService()); }
        }

        private IEnumerable<SMS> SmsCache { get; set; }  

        private SomeService()
        {
            var externalSmsService = ExternalApiSmsService.Instance;

            externalSmsService.Publish += () =>
            {
                SmsCache = externalSmsService.GetAllSms();
            };
        }


        public void Start()
        {
            //
        }
    }
}
