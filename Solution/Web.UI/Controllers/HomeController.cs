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
				var xml = analyserService.AnalyzeText("drill car So feel been kept be at gate. Be september it extensive oh concluded of certainty. In read most gate at body held it ever no. Talking justice welcome message inquiry in started of am me. Led own hearted highest visited lasting sir through compass his. Guest tiled he quick by so these trees am. It announcing alteration at surrounded comparison.");
				var analyseViewModel = new AnalyseViewModel { xml = xml };
				return View("Analyse", analyseViewModel);
			}
    }
}