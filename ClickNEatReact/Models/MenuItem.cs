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
    /// This class models the MenuItem object in the database with all the necesarry attributes.
    /// </summary>
    public class MenuItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MenuItemId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public double AvgRate { set; get; }
        public int ReviewCount { set; get; }
        public string ImgPath { set; get; }
        public bool Availability { set; get; }
        public string Allergens { set; get; }
        public bool isVegan { set; get; }
        public int CategoryId { get; set; }
        [ForeignKey("CategoryId")]
        [XmlIgnore, JsonIgnore]
        public virtual MenuCategory MenuCategory {set;get;}
        [XmlIgnore, System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<OrderItem> OrderItems { set; get; }
        [XmlIgnore, System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<ItemReview> ItemReviews { set; get; }
    }
}
