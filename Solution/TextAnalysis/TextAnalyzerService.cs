using System;

namespace TextAnalysis
{
	using System.IO;
	using System.Linq;

	using Common;

	using Newtonsoft.Json;

	public class TextAnalyzerService : ITextAnalyzerService
    {
	    public string AnalyzeText(string text)
	    {
		    if (text == null || text.Length < 5) text = "empty";

				var alchemyObj = new AlchemyAPI();
				alchemyObj.LoadAPIKey("2bfb53d6c8ac06b2ac12e6a0d3766d66b2aba44b");

				var json = alchemyObj.TextGetRankedKeywords(text);

				// Get keywords from json
				var response = JsonConvert.DeserializeObject<AlchemyRs>(json);
				
				var filePath = string.Format("c:\\models.json");

				var reader = new StreamReader(filePath);
				var jsonReader = new JsonTextReader(reader);
				var serializer = new JsonSerializer();
				var modelList = serializer.Deserialize<ModelList>(jsonReader);
				jsonReader.Close();

		    foreach (var keyword in response.Keywords)
		    {
			    foreach (var model in modelList.Models)
			    {
				    var tags = model.Tags.Split(',');
				    foreach (var tag in tags.Where(tag => tag.Trim() == keyword.Text))
				    {
					    return model.FileUrn;
				    }
			    }
		    }
				return "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y2hhcnNpbnRoZWlyZXllcy9BdWRpK1I4LmRhZQ=="; // blank model
	    }
    }

    public interface ITextAnalyzerService
    {
        string AnalyzeText(string text);
    }
}
