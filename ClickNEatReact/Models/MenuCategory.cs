
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace ClickNEatReact.Models
{
    /// <summary>
    /// This model represents the attributes used for storing and 
    /// retreving MenuCategory data from and in the database.
    /// </summary>
    public class MenuCategory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CategoryId { get; set; }
        public string Name { get; set; }
        [XmlIgnore,JsonIgnore]
        public virtual ICollection<MenuItem> menuItems { set; get; }
    }
}
