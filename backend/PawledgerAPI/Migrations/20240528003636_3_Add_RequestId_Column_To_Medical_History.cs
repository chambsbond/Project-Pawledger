using Microsoft.EntityFrameworkCore.Migrations;

namespace PawledgerAPI.Migrations
{
    public partial class _3_Add_RequestId_Column_To_Medical_History : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RequestId",
                table: "MedicalHistory",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequestId",
                table: "MedicalHistory");
        }
    }
}
