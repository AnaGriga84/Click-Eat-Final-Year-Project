using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClickNEatReact.Models
{
    /// <summary>
    /// This class models the attributes needed for 
    /// the Braintree payment service.
    /// </summary>
    public class TransactionData
    {
        public string Correlation_id { set; get; }
        public string Nonce { set; get; }
        public decimal Ammount { set; get; }
    }
}
