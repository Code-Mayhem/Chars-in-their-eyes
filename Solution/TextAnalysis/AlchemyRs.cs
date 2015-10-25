namespace TextAnalysis
{
	using System.Collections.Generic;

	using Newtonsoft.Json;

	public class AlchemyRs
	{
		[JsonProperty(PropertyName = "keywords")]
		public List<Keyword> Keywords { get; set; }
	}

	public class Keyword
	{
		[JsonProperty(PropertyName = "text")]
		public string Text { get; set; }

		[JsonProperty(PropertyName = "relevance")]
		public string Relevance { get; set; }
	}
}
