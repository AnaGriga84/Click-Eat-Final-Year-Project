using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClickNEatReact.Models
{
    public class ApplicationUser:IdentityUser
    {
        [PersonalData]
        public string FirstName { set; get; }
        [PersonalData]
        public string LastName { set; get; }
    }
}
