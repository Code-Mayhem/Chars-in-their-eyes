namespace TextAnalysis
{
	using System;
	using System.IO;
	using System.Net;
	using System.Text;
	using System.Xml;

	public class AlchemyAPI
	{
		#region Constants and Fields

		private string _apiKey;
		private string _requestUri;

		#endregion

		#region Constructors and Destructors

		public AlchemyAPI()
		{
			_apiKey = "";
			_requestUri = "http://access.alchemyapi.com/calls/";
		}

		#endregion

		#region Public Methods

		public void LoadAPIKey(string key)
		{
			_apiKey = key;

			if (_apiKey.Length < 5)
			{
				var ex =
					new ApplicationException("Error loading API key.");

				throw ex;
			}
		}

		public void SetAPIHost(string apiHost)
		{
			if (apiHost.Length < 2)
			{
				var ex =
					new ApplicationException("Error setting API host.");

				throw ex;
			}

			_requestUri = "http://" + apiHost + ".alchemyapi.com/calls/";
		}

		public void SetAPIKey(string apiKey)
		{
			_apiKey = apiKey;

			if (_apiKey.Length < 5)
			{
				var ex =
					new ApplicationException("Error setting API key.");

				throw ex;
			}
		}

		public string TextGetRankedKeywords(string text)
		{
			CheckText(text);

			return TextGetRankedKeywords(text, new AlchemyAPI_KeywordParams());
		}

		public string TextGetRankedKeywords(string text, AlchemyAPI_KeywordParams parameters)
		{
			CheckText(text);
			parameters.setText(text);
			parameters.setOutputMode(AlchemyAPI_BaseParams.OutputMode.JSON);

			return POST("TextGetRankedKeywords", "text", parameters);
		}

		#endregion

		#region Methods

		private void CheckText(string text)
		{
			if (text.Length < 5)
			{
				var ex =
					new ApplicationException("Enter some text to analyze.");

				throw ex;
			}
		}

		private void CheckURL(string url)
		{
			if (url.Length < 10)
			{
				var ex =
					new ApplicationException("Enter a web URL to analyze.");

				throw ex;
			}
		}

		private string DoRequest(HttpWebRequest wreq, AlchemyAPI_BaseParams.OutputMode outputMode)
		{
			using (var wres = wreq.GetResponse() as HttpWebResponse)
			{
				var r = new StreamReader(wres.GetResponseStream());

				var json = r.ReadToEnd();

				return json;
			}
		}

		private string GET(string callName, string callPrefix, AlchemyAPI_BaseParams parameters)
		{
			// callMethod, callPrefix, ... params
			var uri = new StringBuilder();
			uri.Append(_requestUri).Append(callPrefix).Append("/").Append(callName);
			uri.Append("?apikey=").Append(_apiKey).Append(parameters.getParameterString());

			parameters.resetBaseParams();

			var address = new Uri(uri.ToString());
			var wreq = WebRequest.Create(address) as HttpWebRequest;
			wreq.Proxy = null;

			byte[] postData = parameters.GetPostData();

			if (postData == null)
			{
				wreq.Method = "GET";
			}
			else
			{
				wreq.Method = "POST";
				using (Stream ps = wreq.GetRequestStream())
				{
					ps.Write(postData, 0, postData.Length);
				}
			}

			return DoRequest(wreq, parameters.getOutputMode());
		}

		private string POST(string callName, string callPrefix, AlchemyAPI_BaseParams parameters)
		{
			// callMethod, callPrefix, ... params
			var address = new Uri(_requestUri + callPrefix + "/" + callName);

			var wreq = WebRequest.Create(address) as HttpWebRequest;
			wreq.Proxy = null;
			wreq.Method = "POST";
			wreq.ContentType = "application/x-www-form-urlencoded";

			var d = new StringBuilder();
			d.Append("apikey=").Append(_apiKey).Append(parameters.getParameterString());

			parameters.resetBaseParams();

			byte[] bd = Encoding.UTF8.GetBytes(d.ToString());

			wreq.ContentLength = bd.Length;
			using (Stream ps = wreq.GetRequestStream())
			{
				ps.Write(bd, 0, bd.Length);
			}

			return DoRequest(wreq, parameters.getOutputMode());
		}

		#endregion
	}
}