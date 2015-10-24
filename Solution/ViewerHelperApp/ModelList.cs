namespace ViewerHelperApp
{
	using System.Collections.Generic;

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
