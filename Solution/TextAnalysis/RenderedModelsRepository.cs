using System.IO;
using Common;
using Newtonsoft.Json;

namespace TextAnalysis
{
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