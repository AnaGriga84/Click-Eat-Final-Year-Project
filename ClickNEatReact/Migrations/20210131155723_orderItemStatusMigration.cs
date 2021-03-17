using Microsoft.EntityFrameworkCore.Migrations;

namespace ClickNEatReact.Migrations
{
    public partial class orderItemStatusMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OrderItemStatus",
                table: "OrderItems",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderItemStatus",
                table: "OrderItems");
        }
    }
}
