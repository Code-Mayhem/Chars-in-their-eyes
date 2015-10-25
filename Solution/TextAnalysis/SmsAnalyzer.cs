using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ClockworkSMS.Service;

namespace TextAnalysis
{
    public class SmsAnalyzer
    {
        private static SmsAnalyzer _instance;
        public IOrderedEnumerable<KeyValuePair<string, SMS>> SmsCache { get; set; } 
        public List<string> ProcessedSmsHashes { get; set; }
        public List<SmsRenderModel> SmsRenderModelsCache { get; set; } 

        private ExternalApiSmsService ExternalApiSmsService { get; set; }

        public static SmsAnalyzer Instance
        {
            get { return _instance ?? (_instance = new SmsAnalyzer()); }
        }

        private SmsAnalyzer()
        {
            this.ExternalApiSmsService = ExternalApiSmsService.Instance;
            this.SmsRenderModelsCache = new List<SmsRenderModel>();
            ExternalApiSmsService.Publish += () =>
            {
                this.SmsCache = ExternalApiSmsService.GetAllSms().OrderBy(s => s.Value.Timestamp);
                var unprocessedSms = SmsCache.Except(SmsCache.Where(s => ProcessedSmsHashes.Contains(s.Key)));

                var smsRenderModels = ProcessSms(unprocessedSms);
                if (smsRenderModels.Any())
                {
                    ProcessedSmsHashes.AddRange(smsRenderModels.Select(s => s.Sms.Hash));
                    SmsRenderModelsCache.AddRange(smsRenderModels);
                }
            };
        }

        public IEnumerable<SmsRenderModel> ProcessSms(IEnumerable<KeyValuePair<string, SMS>> unprocessedSms)
        {
            return new List<SmsRenderModel>();
        }
    }
}
