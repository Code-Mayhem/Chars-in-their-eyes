using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClockworkSMS.Service
{
    public class SMS
    {
        public string ID { get; set; }
        public string Text { get; set; }
        public string FromNumber { get; set; }
        public string Hash { get; set; }
        public string Timestamp { get; set; }
    }
}
