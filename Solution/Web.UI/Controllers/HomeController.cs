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
	            var json = SmsAnalyzer.SmsRenderModelsAsJson;
	        };
	    }

	    //
        // GET: /Home/
	    public ActionResult Index(IEnumerable<SmsRenderModel> renderModel)
	    {
            //return View(new ModelList(){Models = new List<Model>(){new Model(){ FileName = "abc"}}});
            return View(RenderModels);
        }

			public ActionResult Analyse()
			{
				var analyserService = new TextAnalyzerService();
				var xml = analyserService.AnalyzeText("what time will you be home for tea?");
				var analyseViewModel = new AnalyseViewModel { xml = xml };
				return View("Analyse", analyseViewModel);
			}
    }
}