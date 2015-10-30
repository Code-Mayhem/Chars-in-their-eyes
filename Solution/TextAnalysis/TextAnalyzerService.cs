using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Common;
using Newtonsoft.Json;

namespace TextAnalysis
{
  public class TextAnalyzerService : ITextAnalyzerService
  {
    private const string BlankModelUrn = "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y2hhcnNpbnRoZWlyZXllcy9haXJwbGFuZS5kd2c=";

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
        return BlankModelUrn;
      }

      var defaultResult = new FileUrnWithRelevancy() {Relevancy = 0, URN = BlankModelUrn};
      var matchedTagsAndRelevancy = new List<FileUrnWithRelevancy> {defaultResult};

      foreach (var model in RenderedModelsRepository.ModelList.Models)
      {
        var tags = model.Tags.Replace(" ", "").Split(',');
        var keywordsStrings = response.Keywords.Select(k => k.Text);

        var intersectTagsWithKeywords = tags.Intersect(keywordsStrings);
        if (intersectTagsWithKeywords.Any())
        {
          var relevancy = response.Keywords.First(k => k.Text == intersectTagsWithKeywords.First()).Relevance;
          var urn = model.FileUrn;

          matchedTagsAndRelevancy.Add(new FileUrnWithRelevancy(){Relevancy = Convert.ToDouble(relevancy), URN = urn});
        }
      }

      var result = defaultResult;
      foreach (var fileUrnWithRelevancy in matchedTagsAndRelevancy)
      {
        if (fileUrnWithRelevancy.Relevancy > result.Relevancy)
        {
          result = fileUrnWithRelevancy;
        }
      }

      return result.URN;
    }

    private static AlchemyRs CallAlchemyApiAnalysisOnText(string text)
    {
      var alchemyApi = new AlchemyAPI();

      const string alchemyKey = "90f8dd08773b83ad901735d47e25b1d2b04228d3";

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

  public class FileUrnWithRelevancy
  {
    public string URN { get; set; }
    public double Relevancy { get; set; }
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