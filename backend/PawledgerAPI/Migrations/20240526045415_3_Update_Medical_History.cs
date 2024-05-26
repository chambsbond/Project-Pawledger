using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace PawledgerAPI.Migrations
{
    public partial class _3_Update_Medical_History : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicalHistory_Pet_PetTokenId",
                table: "MedicalHistory");

            migrationBuilder.DropIndex(
                name: "IX_MedicalHistory_PetTokenId",
                table: "MedicalHistory");

            migrationBuilder.DropColumn(
                name: "PetTokenId",
                table: "MedicalHistory");

            migrationBuilder.DropColumn(
                name: "ResponseBytes",
                table: "MedicalHistory");

            migrationBuilder.RenameColumn(
                name: "CreatedTs",
                table: "Pet",
                newName: "CreatedTimestamp");

            migrationBuilder.RenameColumn(
                name: "CreatedTs",
                table: "MedicalHistory",
                newName: "UpdatedTimestamp");

            migrationBuilder.AlterColumn<long>(
                name: "MedicalHistoryId",
                table: "MedicalHistory",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedTimestamp",
                table: "MedicalHistory",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "EncryptedHistory",
                table: "MedicalHistory",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedTimestamp",
                table: "MedicalHistory");

            migrationBuilder.DropColumn(
                name: "EncryptedHistory",
                table: "MedicalHistory");

            migrationBuilder.RenameColumn(
                name: "CreatedTimestamp",
                table: "Pet",
                newName: "CreatedTs");

            migrationBuilder.RenameColumn(
                name: "UpdatedTimestamp",
                table: "MedicalHistory",
                newName: "CreatedTs");

            migrationBuilder.AlterColumn<string>(
                name: "MedicalHistoryId",
                table: "MedicalHistory",
                type: "text",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "PetTokenId",
                table: "MedicalHistory",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResponseBytes",
                table: "MedicalHistory",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MedicalHistory_PetTokenId",
                table: "MedicalHistory",
                column: "PetTokenId");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalHistory_Pet_PetTokenId",
                table: "MedicalHistory",
                column: "PetTokenId",
                principalTable: "Pet",
                principalColumn: "TokenId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
