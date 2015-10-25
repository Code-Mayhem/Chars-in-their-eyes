using System.Collections.Generic;
using System.Web.Mvc;

namespace Web.UI.Controllers
{
	using Common;

	using TextAnalysis;

	using Web.UI.ViewModels;

	public class HomeController : Controller
    {
	    //
        // GET: /Home/
	    public ActionResult Index()
	    {
            return View(new ModelList(){Models = new List<Model>(){new Model(){ FileName = "abc"}}});
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