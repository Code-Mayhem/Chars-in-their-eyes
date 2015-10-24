using System;
using AutoDesk.Service;

namespace Web.UI
{
    public partial class GetAccessToken : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            var accessTokenRetriever = new AccessTokenRetriever();

            var accessToken = accessTokenRetriever.GetAccessToken();

            Response.ContentType = "application/json";

            Response.Write(accessToken);
            Response.End();
        }
    }
}