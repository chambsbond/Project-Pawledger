using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace PawledgerAPI.Migrations
{
    public partial class MedicalHistory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MEDICAL_HISTORY",
                schema: "pawschema",
                columns: table => new
                {
                    tokenId = table.Column<string>(type: "text", nullable: false),
                    medicalHistoryId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    eventType = table.Column<string>(type: "text"),
                    eventValue = table.Column<string>(type: "text")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MEDICAL_HISTORY", x => x.medicalHistoryId);
                }
                );

            migrationBuilder.AddForeignKey(
                name: "FK_Medical_History_tokenId",
                table: "MEDICAL_HISTORY",
                column: "tokenId",
                principalTable: "PET",
                principalColumn: "tokenId",
                onDelete: ReferentialAction.Restrict);

        }
    }
}
