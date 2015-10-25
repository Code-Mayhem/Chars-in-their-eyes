using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public static class Logger
    {
        public static List<Exception> Exceptions = new List<Exception>();

        public static void Log(Exception e)
        {
            Exceptions.Add(e);
        }
    }
}
