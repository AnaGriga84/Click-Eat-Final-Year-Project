using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ClickNEatReact.Models
{
    /// <summary>
    /// This class model the Registration object for the Register feature.
    /// </summary>
    public class RegistrationModel
    {
        [Required(ErrorMessage = "Username is Required")]
        public string Username { set; get; }
        [Required(ErrorMessage = "Firstname is Required")]
        public string Firstname { set; get; }
        [Required(ErrorMessage = "Lastname is Required")]
        public string Lastname { set; get; }

        [Required(ErrorMessage = "Pasword is Required")]
        public string Password { set; get; }
        [Required(ErrorMessage = "Phone number is Required")]
        public string Phone { set; get; }
        [Required(ErrorMessage = "Email address is Required")]
        public string Email { set; get; }
    }
}
