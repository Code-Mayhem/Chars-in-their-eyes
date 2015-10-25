﻿using RestSharp;
using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Windows.Forms;


namespace ViwerSteps
{
	using System.Collections.Generic;

	using Newtonsoft.Json;

	using ViewerHelperApp;

	public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        const String strClient = "https://developer.api.autodesk.com";
        RestClient _client = new RestClient(strClient);

        String strConsumerKey = "";
        String strConsumerSecret = "";

        String _token = "";
        string _fileUrn = "";
        void updatelistBox1(string strText)
        {
            richTextBox1.Text = richTextBox1.Text + strText + "\n";

            richTextBox1.Invalidate();
            this.Invalidate();
        }

        bool authentication()
        {
            RestRequest authReq = new RestRequest();
            authReq.Resource = "authentication/v1/authenticate";
            authReq.Method = Method.POST;
            authReq.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            authReq.AddParameter("client_id", strConsumerKey);
            authReq.AddParameter("client_secret", strConsumerSecret);
            authReq.AddParameter("grant_type", "client_credentials");

            IRestResponse result = _client.Execute(authReq);
            if (result.StatusCode == System.Net.HttpStatusCode.OK)
            {
                String responseString = result.Content;
                int len = responseString.Length;
                int index = responseString.IndexOf("\"access_token\":\"") + "\"access_token\":\"".Length;
                responseString = responseString.Substring(index, len - index - 1);
                int index2 = responseString.IndexOf("\"");
                _token = responseString.Substring(0, index2);


                updatelistBox1("Token : " + _token);
                textBox_token.Text = _token;

                //now set the token.
                RestRequest setTokenReq = new RestRequest();
                setTokenReq.Resource = "utility/v1/settoken";
                setTokenReq.Method = Method.POST;
                setTokenReq.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                setTokenReq.AddParameter("access-token", _token);

                IRestResponse resp = _client.Execute(setTokenReq);
                if (resp.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    //done...
                    updatelistBox1("Set token Successfully");
                    return true;
                }
            }
            return false;

        }

        //create the bucket to upload
        bool createBuket(string bucketname)
        {
            RestRequest bucketReq = new RestRequest();
            bucketReq.Resource = "oss/v1/buckets";
            bucketReq.Method = Method.POST;
            bucketReq.AddParameter("Authorization", "Bearer " + _token, ParameterType.HttpHeader);
            bucketReq.AddParameter("Content-Type", "application/json", ParameterType.HttpHeader);

            //bucketname is the name of the bucket.
            string body = "{\"bucketKey\":\"" + bucketname + "\",\"policy\":\"transient\"}";
            bucketReq.AddParameter("application/json", body, ParameterType.RequestBody);

            IRestResponse resp = _client.Execute(bucketReq);

            if (resp.StatusCode == System.Net.HttpStatusCode.Conflict)
            {
                updatelistBox1("Bucket " + bucketname + " already present");
                return false;
            }
            if (resp.StatusCode == System.Net.HttpStatusCode.OK)
            {
                updatelistBox1("Bucket " + bucketname + " created");
                return true;

            }

            return false;

        }



        bool uploadFile(string strFile, ref string fileUrn)
        {
            RestRequest uploadReq = new RestRequest();

            string strFilename = System.IO.Path.GetFileName(strFile);
            string objectKey = HttpUtility.UrlEncode(strFilename);


            FileStream file = File.Open(strFile, FileMode.Open);
            byte[] fileData = null;
            int nlength = (int)file.Length;
            using (BinaryReader reader = new BinaryReader(file))
            {
                fileData = reader.ReadBytes(nlength);
            }

            uploadReq.Resource = "oss/v1/buckets/" + txtBucketName.Text.ToLower() + "/objects/" + objectKey;
            uploadReq.Method = Method.PUT;
            uploadReq.AddParameter("Authorization", "Bearer " + _token, ParameterType.HttpHeader);
            uploadReq.AddParameter("Content-Type", "application/stream");
            uploadReq.AddParameter("Content-Length", nlength);
            uploadReq.AddParameter("requestBody", fileData, ParameterType.RequestBody);

            IRestResponse resp = _client.Execute(uploadReq);

            if (resp.StatusCode == System.Net.HttpStatusCode.OK)
            {
                updatelistBox1("file " + strFile + " uploaded");

                string responseString = resp.Content;

                int len = responseString.Length;
                string id = "\"id\" : \"";
                int index = responseString.IndexOf(id) + id.Length;
                responseString = responseString.Substring(index, len - index - 1);
                int index2 = responseString.IndexOf("\"");
                string urn = responseString.Substring(0, index2);

                updatelistBox1("file id :" + urn);

                byte[] bytes = Encoding.UTF8.GetBytes(urn);
                string urn64 = Convert.ToBase64String(bytes);

                RestRequest bubleReq = new RestRequest();
                bubleReq.Resource = "viewingservice/v1/register";
                bubleReq.Method = Method.POST;
                bubleReq.AddParameter("Authorization", "Bearer " + _token, ParameterType.HttpHeader);
                bubleReq.AddParameter("Content-Type", "application/json;charset=utf-8", ParameterType.HttpHeader);

                string body = "{\"urn\":\"" + urn64 + "\"}";
                bubleReq.AddParameter("application/json", body, ParameterType.RequestBody);

                fileUrn = urn64;
                updatelistBox1("urn:" + urn64);

                IRestResponse BubbleResp = _client.Execute(bubleReq);

                if (BubbleResp.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    //Translation started
                    updatelistBox1("file " + strFile + " Translation started");
                    return true;

                }
                else if (BubbleResp.StatusCode == System.Net.HttpStatusCode.Created)
                {
                    //already present
                    updatelistBox1("file " + strFile + " Translation already present");
                    return true;
                }
                else
                {
                    //error

                    return false;
                }



            }
            else
            {
                updatelistBox1("file " + strFile + " upload failed");
            }


            return false;

        }


        //upload the model.
        bool upload(string strFile, ref string fileUrn)
        {


            if (uploadFile(strFile, ref fileUrn) == false)
            {
                return false;
            }

            return true;
        }



        void getTheProgress(string fileUrn, bool update)
        {
            RestRequest thumnail = new RestRequest();
            thumnail.Resource = "/viewingservice/v1/" + fileUrn;
            thumnail.Method = Method.GET;
            thumnail.AddParameter("Authorization", "Bearer " + _token, ParameterType.HttpHeader);
            IRestResponse thumbResp = _client.Execute(thumnail);

            if (thumbResp.StatusCode == System.Net.HttpStatusCode.OK)
            {

                dynamic json = SimpleJson.DeserializeObject(thumbResp.Content);

                System.Collections.Generic.Dictionary<string, object>.KeyCollection keys = json.Keys;
                System.Collections.Generic.Dictionary<string, object>.ValueCollection Values = json.Values;

                //object title = json.Keys["status"];
                updatelistBox1(" ");
                updatelistBox1(" ----------results--------");
                for (int i = 0; i < Values.Count; i++)
                {
                    var key = keys.ElementAt(i);
                    var item = Values.ElementAt(i);


                    if (key is string && item is string)
                    {
                        updatelistBox1((string)key + "=" + (string)item);

                        if (String.Compare((string)key, "progress") == 0)
                        {
                            label1_per.Text = (string)item;
                        }
                    }


                }
                updatelistBox1(" ----------results--------");
                updatelistBox1(" ");

                if (!update)
                {
                    updatelistBox1(" ----------all content--------");
                    updatelistBox1(thumbResp.Content);
                    updatelistBox1(" ----------all content--------");
                }


            }
            else
            {
                updatelistBox1(thumbResp.Content);
            }
        }

        void Thumbnails(string fileUrn)
        {

            RestRequest thumnail = new RestRequest();
            thumnail.Resource = "/viewingservice/v1/thumbnails/" + fileUrn;
            thumnail.Method = Method.GET;
            thumnail.AddParameter("Authorization", "Bearer " + _token, ParameterType.HttpHeader);
            IRestResponse thumbResp = _client.Execute(thumnail);
            if (thumbResp.StatusCode == System.Net.HttpStatusCode.OK)
            {
                MemoryStream ms = new MemoryStream(thumbResp.RawBytes);
                pictureBox1.Image = Image.FromStream(ms);
                pictureBox1.Invalidate();

                updatelistBox1("showing thumbnail");
            }
            else
            {
                updatelistBox1("showing thumbnail failed");
            }


        }



        private void button1_Click(object sender, EventArgs e)
        {
            openFileDialog1 = new OpenFileDialog();
            //openFileDialog1.Filter = "3d Files (*.stl, *.dwf, *.dwg, *.nwc, *.3ds, *.rvt, *.iam, *.dwfx) | *.stl; *.dwf; *.dwg; *.nwc;*.3ds;*.rvt;*.iam;*.dwfx";
            if (openFileDialog1.ShowDialog() == DialogResult.OK)
            {
              richTextBox1.Text = "";
              label1_filename.Text = openFileDialog1.FileName;
              label1_filename.Invalidate();
              this.Invalidate();
              //

              if (authentication() == false)
                  return;

              string fileUrn = "";
              if (upload(openFileDialog1.FileName, ref fileUrn) == false)
                  return;

              Thumbnails(fileUrn);

              getTheProgress(fileUrn, false);

	            _fileUrn = fileUrn;

	            saveToJson(fileUrn, tags.Text, openFileDialog1.FileName);
            }
        }

			private void saveToJson(string fileUrn, string tags, string filename)
			{
				var filePath = string.Format("c:\\models.json");
			
				var reader = new StreamReader(filePath);
				var jsonReader = new JsonTextReader(reader);
				var serializer = new JsonSerializer();
				var modelList = serializer.Deserialize<ModelList>(jsonReader);
				jsonReader.Close();

				if (modelList == null)
				{
					modelList = new ModelList{Models = new List<Model>()};
				}

				if (modelList.Models.All(x => x.FileUrn != fileUrn))
				{
					var model = new Model { FileUrn = fileUrn, Tags = tags, FileName = filename };
					modelList.Models.Add(model);
				}

				var writer = new StreamWriter(filePath);
				var jsonWriter = new JsonTextWriter(writer);
				var ser = new JsonSerializer();
				ser.Serialize(jsonWriter, modelList);
				jsonWriter.Flush();
			}

        private void button_status_Click(object sender, EventArgs e)
        {
            Thumbnails(_fileUrn);
            getTheProgress(_fileUrn, true);
        }


        //New token
        private void button2_Click(object sender, EventArgs e)
        {
            //read the Key & Secret
            strConsumerKey = textBox1_key.Text;
            strConsumerSecret = textBox_Consumer_Secret.Text;

            updatelistBox1("");
            updatelistBox1(" ----------Getting token--------");
            authentication();
            updatelistBox1(" ----------Getting token--------");
            updatelistBox1("");
        }

        private void btnCreateBucket_Click(object sender, EventArgs e)
        {
            if (txtBucketName.Text.Trim() == string.Empty)
            {
                MessageBox.Show("You must input to a bucket name.");
            }
            //create required bucket
            if (createBuket(txtBucketName.Text.ToLower()) == false)
            {
                updatelistBox1(" ----------Create Bucket failed--------");
            }
        }

        private void btnViewInBrowser_Click(object sender, EventArgs e)
        {

            //Start the viewer in default browser, this browser should 
            //support WebGL, latest version of Google Chrome or Firefox are recommended.

            string url = string.Format("http://viewer.autodesk.io/node/view-helper?urn={0}&token={1}", _fileUrn, _token);

            Process.Start(url);

        }

				private void label5_Click(object sender, EventArgs e)
				{

				}



    }
}
