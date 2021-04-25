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
    /// This class models the Payment object.
    /// </summary>
    public class Payment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PaymentId { set; get; }
        public string CardHolderName { set; get; }
        public double Amount { set; get; }
        public string CardNumber { set; get; }
        public string ExpireDate { set; get; }
        public string CVV { set; get; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedAt { set; get; }
        public int OrderId { set; get; }
        [ForeignKey("OrderId")]
        [XmlIgnore, JsonIgnore]
        public virtual Order order { set; get; }
    }
}
