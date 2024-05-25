using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace PawledgerAPI.Migrations
{
    public partial class _1_Create_Pet_and_Medical_History_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MedicalHistory",
                columns: table => new
                {
                    MedicalHistoryId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TokenId = table.Column<string>(type: "text", nullable: true),
                    EncryptedHistory = table.Column<string>(type: "text", nullable: false),
                    CreatedTimestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedTimestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalHistory", x => x.MedicalHistoryId);
                });

            migrationBuilder.CreateTable(
                name: "Pet",
                columns: table => new
                {
                    TokenId = table.Column<string>(type: "text", nullable: false),
                    CreatedTimestamp = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pet", x => x.TokenId);
                });
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
