//using Microsoft.Extensions.Configuration;
//using PayPalCheckoutSdk.Core;
//using PayPal;
//using PayPalHttp;
//using System;
//using System.Collections.Generic;
//using System.IO;
//using System.Linq;
//using System.Runtime.Serialization.Json;
//using System.Text;
//using System.Threading.Tasks;
//using PayPalCheckoutSdk.Orders;

//namespace ClickNEatReact.Services
//{
//    public class PayPalClient
//    {
//        private static IConfiguration _configuration;
//        public  PayPalClient(IConfiguration configuration)
//        {
//            _configuration = configuration;
//            Console.WriteLine(_configuration["Paypal:clientId"]);
//        }
//        public static PayPalEnvironment environment()
//        {
           
//            return new SandboxEnvironment(_configuration["Paypal:clientId"], _configuration["Paypal:secrete"]);
//        }

//        public static HttpClient client()
//        {
//            return new PayPalHttpClient(environment());
//        }
//        public static HttpClient client(string refreshToken)
//        {
//            return new PayPalHttpClient(environment(), refreshToken);
//        }

//        /**
//            Use this method to serialize Object to a JSON string.
//        */
//        public static String ObjectToJSONString(Object serializableObject)
//        {
//            MemoryStream memoryStream = new MemoryStream();
//            var writer = JsonReaderWriterFactory.CreateJsonWriter(
//                        memoryStream, Encoding.UTF8, true, true, "  ");
//            DataContractJsonSerializer ser = new DataContractJsonSerializer(serializableObject.GetType(), new DataContractJsonSerializerSettings { UseSimpleDictionaryFormat = true });
//            ser.WriteObject(writer, serializableObject);
//            memoryStream.Position = 0;
//            StreamReader sr = new StreamReader(memoryStream);
//            return sr.ReadToEnd();
//        }

//        public async static Task<HttpResponse> createOrder()
//        {
//            HttpResponse response;
//            // Construct a request object and set desired parameters
//            // Here, OrdersCreateRequest() creates a POST request to /v2/checkout/orders
//            var order = new OrderRequest()
//            {
//                CheckoutPaymentIntent = "CAPTURE",
//                PurchaseUnits = new List<PurchaseUnitRequest>()
//                {
//                    new PurchaseUnitRequest()
//                    {
//                        AmountWithBreakdown = new AmountWithBreakdown()
//                        {
//                            CurrencyCode = "USD",
//                            Value = "100.00",
//                            AmountBreakdown = new AmountBreakdown
//                            {
//                                ItemTotal = new Money
//                                {
//                                    CurrencyCode = "USD",
//                                    Value = "100.00"
//                                }
//                            },

//                        },
//                        Items = new List<Item>
//                        {
//                            new Item
//                            {
//                                Name = "T-shirt",
//                                Description = "Green XL",
//                                Sku = "sku01",
//                                UnitAmount = new Money
//                                {
//                                    CurrencyCode = "USD",
//                                    Value = "50.00"
//                                },
//                                Quantity = "1",
//                                Category = "PHYSICAL_GOODS"
//                            },
//                            new Item
//                            {
//                                Name = "Shoes",
//                                Description = "Running, Size 10.5",
//                                Sku = "sku02",
//                                UnitAmount = new Money
//                                {
//                                    CurrencyCode = "USD",
//                                    Value = "25.00"
//                                },
//                                Quantity = "2",
//                                Category = "PHYSICAL_GOODS"
//                            }
//                        }
//                    }
//                },
//                ApplicationContext = new ApplicationContext()
//                {
//                    ReturnUrl = "https://www.example.com",
//                    CancelUrl = "https://www.example.com"
//                }
//            };


//            // Call API with your client and get a response for your call
//            var request = new OrdersCreateRequest();
//            request.Prefer("return=representation");
//            request.RequestBody(order);
//            response = await client().Execute(request);
//            var statusCode = response.StatusCode;
//            Order result = response.Result<Order>();
//            Console.WriteLine("Status: {0}", result.Status);
//            Console.WriteLine("Order Id: {0}", result.Id);
//            Console.WriteLine("Intent: {0}", result.CheckoutPaymentIntent);
//            Console.WriteLine("Links:");
//            foreach (LinkDescription link in result.Links)
//            {
//                Console.WriteLine("\t{0}: {1}\tCall Type: {2}", link.Rel, link.Href, link.Method);
//            }
//            return response;
//        }

//        public async static Task<HttpResponse> captureOrder()
//        {
//            // Construct a request object and set desired parameters
//            // Replace ORDER-ID with the approved order id from create order
//            var request = new OrdersCaptureRequest("5DN461758S256560P");
//            request.RequestBody(new OrderActionRequest());
//            HttpResponse response = await client().Execute(request);
//            var statusCode = response.StatusCode;
//            Order result = response.Result<Order>();
//            Console.WriteLine("Status: {0}", result.Status);
//            Console.WriteLine("Capture Id: {0}", result.Id);
//            return response;
//        }
//    }
//}
