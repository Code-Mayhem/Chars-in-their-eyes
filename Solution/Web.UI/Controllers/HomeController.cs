using System.Collections.Generic;
using System.Web.Mvc;

namespace Web.UI.Controllers
{
	using Common;

	using TextAnalysis;

	using Web.UI.ViewModels;

	public class HomeController : Controller
	{
	    public SmsAnalyzer SmsAnalyzer { get; set; }

        public List<SmsRenderModel> RenderModels { get; set; } 

	    public HomeController()
	    {
	        SmsAnalyzer = SmsAnalyzer.Instance;
	        RenderModels = new List<SmsRenderModel>();
	        SmsAnalyzer.Publish += () =>
	        {
	            RenderModels = SmsAnalyzer.SmsRenderModelsCache;
	        };
	    }

	    //
        // GET: /Home/
	    public ActionResult Index(IEnumerable<SmsRenderModel> renderModel)
	    {
            return View(RenderModels);
        }
    }
}