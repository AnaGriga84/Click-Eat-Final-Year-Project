using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClickNEatReact.Models
{
    /// <summary>
    /// This class models the Password data in the database with 
    /// the required attributes.
    /// </summary>
    public class PasswordData
    {
        public string OldPassword { set; get; }
        public string NewPassword { set; get; }
        public string ConfirmPassword { set; get; }
    }
}
