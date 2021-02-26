using ClickNEatReact.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClickNEatReact.Data
{
    public class ClickEatContext:IdentityDbContext<ApplicationUser>
    {
        public ClickEatContext(DbContextOptions<ClickEatContext> options):base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<ItemReview>()
            .Property(b => b.CreatedAt)
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
