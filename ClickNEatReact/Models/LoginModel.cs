using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ClickNEatReact.Models
{
    public class LoginModel
    {

        [Required(ErrorMessage = "Username is Required")]
        public string Username { set; get; }
        [Required(ErrorMessage = "Pasword is Required")]
        public string Password { set; get; }
    }
}
