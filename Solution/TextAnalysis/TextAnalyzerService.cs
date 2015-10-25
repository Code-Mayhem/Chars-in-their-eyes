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
	        if (text == null || text.Length < 5)
	        {
	            text = "empty";
	        }

	        text = text.Replace("%20", " ");

			var response = CallAlchemyApiAnalysisOnText(text);

            if (response == null || response.Keywords == null || !response.Keywords.Any())
	        {
	            return "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y2hhcnNpbnRoZWlyZXllcy9haXJwbGFuZS5kd2c="; // blank model
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

	        return "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y2hhcnNpbnRoZWlyZXllcy9haXJwbGFuZS5kd2c="; // blank model

        }

	    private static AlchemyRs CallAlchemyApiAnalysisOnText(string text)
	    {
	        var alchemyObj = new AlchemyAPI();
	        alchemyObj.LoadAPIKey("2bfb53d6c8ac06b2ac12e6a0d3766d66b2aba44b");

	        var json = alchemyObj.TextGetRankedKeywords(text);

	        // Get keywords from json
	        var response = JsonConvert.DeserializeObject<AlchemyRs>(json);
	        return response;
	    }
    }

    public interface ITextAnalyzerService
    {
        string AnalyzeText(string text);
    }

    public static class RenderedModelsRepository
    {
        private static ModelList _modelList;

        public static ModelList ModelList
        {
            get
            {
                if (_modelList == null)
                {
                    _modelList = ReadFile();
                }

                return _modelList;
            }
        }

        private static ModelList ReadFile()
        {
            var filePath = string.Format("c:\\models.json");

            var reader = new StreamReader(filePath);
            var jsonReader = new JsonTextReader(reader);
            var serializer = new JsonSerializer();
            var modelList = serializer.Deserialize<ModelList>(jsonReader);
            jsonReader.Close();

            return modelList;
        }
    }
}
