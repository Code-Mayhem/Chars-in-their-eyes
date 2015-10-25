using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ClockworkSMS.Service;
using Newtonsoft.Json;

namespace TextAnalysis
{
    public class SmsAnalyzer
    {
        private static SmsAnalyzer _instance;
        public IOrderedEnumerable<KeyValuePair<string, SMS>> SmsCache { get; set; } 
        public List<string> ProcessedSmsHashes { get; set; }
        public List<SmsRenderModel> SmsRenderModelsCache { get; set; } 

        private ExternalApiSmsService ExternalApiSmsService { get; set; }

        public string SmsRenderModelsAsJson
        {
            get
            {
                return JsonConvert.SerializeObject(SmsRenderModelsCache);
                
            }
        }

        public static SmsAnalyzer Instance
        {
            get { return _instance ?? (_instance = new SmsAnalyzer()); }
        }

        private SmsAnalyzer()
        {
            this.ExternalApiSmsService = ExternalApiSmsService.Instance;
            this.SmsRenderModelsCache = new List<SmsRenderModel>();
            this.ProcessedSmsHashes = new List<string>();

            ExternalApiSmsService.Publish += () =>
            {
                this.SmsCache = ExternalApiSmsService.GetAllSms().OrderBy(s => s.Value.Timestamp);
                var unprocessedSms = SmsCache.Except(SmsCache.Where(s => ProcessedSmsHashes.Contains(s.Key)));

                var smsRenderModels = ProcessSms(unprocessedSms);
                if (smsRenderModels.Any())
                {
                    ProcessedSmsHashes.AddRange(smsRenderModels.Select(s => s.Sms.Hash));
                    SmsRenderModelsCache.AddRange(smsRenderModels);

                    Publish.Invoke();
                }
            };
        }

        public IEnumerable<SmsRenderModel> ProcessSms(IEnumerable<KeyValuePair<string, SMS>> unprocessedSms)
        {
			var model = new List<SmsRenderModel>();
	        var textAnalyzerService = new TextAnalyzerService();

	        foreach (var sms in unprocessedSms)
	        {
		        var urn = textAnalyzerService.AnalyzeText(sms.Value.Text);
		        var smsRenderModel = new SmsRenderModel { Sms = sms.Value, Urn = urn };
				model.Add(smsRenderModel);
	        }

	        return model;
        }

        public event Action Publish;
    }
}
