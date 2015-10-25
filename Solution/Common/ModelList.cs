using System.Collections.Generic;

namespace Common
{
    public class ModelList
	{
		public List<Model> Models { get; set; }
	}

	public class Model
	{
		public string FileUrn { get; set; }
		public string Tags { get; set; }
		public string FileName { get; set; }
	}
}
