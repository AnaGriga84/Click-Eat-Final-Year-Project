using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClickNEatReact
{
    /// <summary>
    /// Program.cs is the entry point for an aplication.
    /// See <a href="https://www.tutorialspoint.com/what-is-the-purpose-of-program-cs-file-in-chash-asp-net-core-project"></a>
    /// </summary>
    public class Program
    {
        /// <summary>
        /// An Asp.Net Core web application is bassically a console project that runs from the public static void Main() method in this Program.cs class, where a web application host is built.
        /// See <a href="https://www.tutorialspoint.com/what-is-the-purpose-of-program-cs-file-in-chash-asp-net-core-project"></a>
        /// </summary>
        /// <param name="args">args parameter stores all command line arguments which are given by the user when a program is ran.</param>

        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }
        /// <summary>
        /// Creates a non-HTTP workload with an IHostedService implementation added to the DI container.
        /// See <a href="https://www.tutorialspoint.com/what-is-the-purpose-of-program-cs-file-in-chash-asp-net-core-project"></a>
        /// </summary>
        /// <param name="args">args parameter stores all command line arguments which are given by the user when a program is ran</param>
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
