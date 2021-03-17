using Microsoft.EntityFrameworkCore.Migrations;

namespace ClickNEatReact.Migrations
{
    public partial class menuItemMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "imgPath",
                table: "menuItems",
                newName: "ImgPath");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImgPath",
                table: "menuItems",
                newName: "imgPath");
        }
    }
}
