using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace PawledgerAPI.Migrations
{
    public partial class PET : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "pawschema");

            migrationBuilder.CreateTable(
                name: "PET",
                schema: "pawschema",
                columns: table => new
                {
                    tokenId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PET", x => x.tokenId);
                }
                    );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PET",
                schema: "pawschema");
        }
    }
}
