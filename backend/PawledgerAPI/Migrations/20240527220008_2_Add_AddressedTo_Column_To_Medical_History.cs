using Microsoft.EntityFrameworkCore.Migrations;

namespace PawledgerAPI.Migrations
{
    public partial class _2_Add_AddressedTo_Column_To_Medical_History : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AddressedTo",
                table: "MedicalHistory",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AddressedTo",
                table: "MedicalHistory");
        }
    }
}
