using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace ClockworkSMS.Service
{
    [DataContract]
    public class ExternalApiJsonModelWrapper
    {
        [DataMember]
        public List<SMS> SMSList { get; set; }
    }
}
