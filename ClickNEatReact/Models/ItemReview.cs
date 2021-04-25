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
    /// This is the model class which models the data for the 
    /// review feature in the application. It mirrors a database table.
    /// </summary>
    public class ItemReview
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReviewId { set; get; }
        public float Rate { set; get; }
        public string Comment { set; get; }
        public string Reviewer { set; get; }
        public int OrderItemId { set; get; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedAt { set; get; }
        public int MenuItemId { set; get; }
        [ForeignKey("MenuItemId")]
        [XmlIgnore,JsonIgnore]
        public virtual MenuItem MenuItem { set; get; }
    }
}
