using Braintree;
using ClickNEatReact.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace ClickNEatReact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BraintreeController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IBraintreeGateway gateway;
        public BraintreeController(IConfiguration configuration)
        {
            _configuration = configuration;
            gateway = new BraintreeGateway
            {
                Environment = Braintree.Environment.SANDBOX,
                MerchantId = _configuration["Braintree:MerchantId"],
                PublicKey = _configuration["Braintree:PublicKey"],
                PrivateKey = _configuration["Braintree:PrivateKey"]
            };
            
        }

        [HttpGet]
        public ObjectResult GetClientToken()
        {
            var token = gateway.ClientToken.Generate();
            
            return Ok(new{ token = token });
        }

        [HttpPost]
        public ObjectResult Transaction([FromBody] TransactionData data)
        {
            var req = new TransactionRequest
            {
                Amount = data.Ammount,
                PaymentMethodNonce = data.Nonce,
                DeviceData = "{\"correlation_id\":\""+data.Correlation_id+"\"}",
                CurrencyIsoCode="EUR",
                Options=new TransactionOptionsRequest
                {
                    SubmitForSettlement=true
                }
                
            };

            Result<Transaction> result = gateway.Transaction.Sale(req);

            return Ok(new { result=result });
        }


    }
}
