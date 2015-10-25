using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using TextAnalysis;

namespace Web.UI.Hubs
{
    public class SmsRenderHub : Hub
    {
        readonly SmsAnalyzer _smsAnalyzer = SmsAnalyzer.Instance;

        public void SendNewSmsRenders()
        {
            Clients.All.addNewSmsRenders(_smsAnalyzer.SmsRenderModelsAsJson);
        }
    }
}