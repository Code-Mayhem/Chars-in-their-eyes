using System;

namespace TextAnalysis
{
    using System.Linq;
    using Newtonsoft.Json;

	public class TextAnalyzerService : ITextAnalyzerService
    {
	    private string _blankModelUrn = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y2hhcnNpbnRoZWlyZXllcy9haXJwbGFuZS5kd2c=";

	    public string AnalyzeText(string text)
	    {
	        if (text == null || text.Length < 5)
	        {
	            text = "empty";
	        }

	        text = text.Replace("%20", " ");

			var response = CallAlchemyApiAnalysisOnText(text);

	        if (response == null || response.Keywords == null || !response.Keywords.Any())
	        {
	            return _blankModelUrn; // blank model
	        }

	        foreach (var model in RenderedModelsRepository.ModelList.Models)
	        {
	            var tags = model.Tags.Replace(" ", "").Split(',');
	            var keywordsStrings = response.Keywords.Select(k => k.Text);

	            var intersectTagsWithKeywords = tags.Intersect(keywordsStrings);
	            if (intersectTagsWithKeywords.Any())
	            {
	                return model.FileUrn;
	            }
	        }

	        return _blankModelUrn; // blank model
        }

	    private static AlchemyRs CallAlchemyApiAnalysisOnText(string text)
	    {
	        var alchemyApi = new AlchemyAPI();
	        var alchemyKey = "90f8dd08773b83ad901735d47e25b1d2b04228d3";

	        alchemyApi.LoadAPIKey(alchemyKey);

	        var jsonResponse = alchemyApi.TextGetRankedKeywords(text);

	        // Get keywords from json
	        var response = JsonConvert.DeserializeObject<AlchemyRs>(jsonResponse);

	        if (response.Status == "ERROR")
	        {
	            throw new Exception("Alchemy daily limit reached");
	        }
	        return response;
	    }
    }
}
