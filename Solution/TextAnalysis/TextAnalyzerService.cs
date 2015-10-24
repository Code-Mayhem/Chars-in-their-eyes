using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace TextAnalysis
{
    public class TextAnalyzerService : ITextAnalyzerService
    {
        public void AnalyzeText(string text)
        {
            throw new NotImplementedException();
        }
    }

    public interface ITextAnalyzerService
    {
        void AnalyzeText(string text);
    }
}
