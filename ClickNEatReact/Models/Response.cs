using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClickNEatReact.Models
{
    /// <summary>
    /// This class models the Response status codes 
    /// and the title of the responses for the authentication purposes.
    /// </summary>
    public class Response
    {
        public string status { set; get; }
        public string title { set; get; }
    }
}
