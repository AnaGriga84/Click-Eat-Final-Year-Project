using Microsoft.EntityFrameworkCore.Migrations;

namespace ClickNEatReact.Migrations
{
    public partial class menuItemIsVegan : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "isVegan",
                table: "menuItems",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isVegan",
                table: "menuItems");
        }
    }
}
