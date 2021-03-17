
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
    public class OrderItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int OrderItemId { set; get; }
        public int ItemAmmount { set; get; }
        public double price { set; get; }
        public string OrderItemStatus { set; get; }
        public bool IsReviewed { set; get; }
        public string Instruction { set; get; }
        public int MenuItemId { set; get; }
        [ForeignKey("MenuItemId")]

        [XmlIgnore, Newtonsoft.Json.JsonIgnore]
        public virtual MenuItem MenuItem { set; get; }

        [XmlIgnore, JsonIgnore]
        public virtual Order Order { set; get; }
    }
}
