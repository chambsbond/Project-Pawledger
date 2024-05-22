using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace PawledgerAPI.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Pet",
                columns: table => new
                {
                    TokenId = table.Column<string>(type: "text", nullable: false),
                    CreatedTs = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pet", x => x.TokenId);
                });

            migrationBuilder.CreateTable(
                name: "MedicalHistory",
                columns: table => new
                {
                    MedicalHistoryId = table.Column<string>(type: "text", nullable: false),
                    TokenId = table.Column<string>(type: "text", nullable: true),
                    ResponseBytes = table.Column<string>(type: "json", nullable: true),
                    CreatedTs = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    PetTokenId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalHistory", x => x.MedicalHistoryId);
                    table.ForeignKey(
                        name: "FK_MedicalHistory_Pet_PetTokenId",
                        column: x => x.PetTokenId,
                        principalTable: "Pet",
                        principalColumn: "TokenId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicalHistory_PetTokenId",
                table: "MedicalHistory",
                column: "PetTokenId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MedicalHistory");

            migrationBuilder.DropTable(
                name: "Pet");
        }
    }
}
