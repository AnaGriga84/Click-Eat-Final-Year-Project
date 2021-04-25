using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace ClickNEatReact.Models
{
    /// <summary>
    /// This class models the data for the Order object will all necessary attributes.
    /// </summary>
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        
        public int OrderId { set; get; }
        public double Total { set; get; }
        public string Instruction { set; get; }
        public string TableIdentity { set; get; }
        public string Status { set; get; }
        [XmlIgnore, JsonIgnore]
        public virtual ICollection<OrderItem> OrderItems { set; get; }
    }
}
