using ClickNEatReact.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClickNEatReact.Data
{
    /// <summary>
    ///  A single Context class is used that inherits from IdentityDbContext.This way the context is aware of any 
    ///  relations betweeen the existing classes and the IdentityUser and Roles of the IdentityDbContext.
    /// This way the overheads are reduced. This concept is basically a DbContext with a set data for 
    /// the users and one for the roles.
    /// </summary>
    public class ClickEatContext:IdentityDbContext<ApplicationUser>
    {
        public ClickEatContext(DbContextOptions<ClickEatContext> options):base(options)
        {

        }
        /// <summary>
        /// This method is called when the context is first created to build the model and the mapping in the memory.
        /// </summary>
        /// <param name="builder">OnModelCreating method takes and instance of ModelBuilder as a parameter</param>
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<ItemReview>()
            .Property(b => b.CreatedAt)
            .HasDefaultValueSql("getdate()");
            builder.Entity<Payment>()
            .Property(p => p.CreatedAt)
            .HasDefaultValueSql("getdate()");
        }

        public DbSet<Order> orders { set; get; }
        public DbSet<MenuCategory> menuCategories { set; get; }
        public DbSet<MenuItem> menuItems { set; get; }
        public DbSet<Payment> Payment { get; set; }
        public DbSet<OrderItem> OrderItems { set; get; }
        public DbSet<ItemReview> ItemReviews { set; get; }
    }
}
