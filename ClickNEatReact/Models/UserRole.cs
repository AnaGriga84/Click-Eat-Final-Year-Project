using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClickNEatReact.Models
{
    /// <summary>
    /// This model class sets up the role attributes 
    /// for authorization purposes.
    /// </summary>
    public static class UserRole
    {
        public const string User = "User";
        public const string Admin = "Admin";
        public const string Waiter = "Waiter";
    }
}
