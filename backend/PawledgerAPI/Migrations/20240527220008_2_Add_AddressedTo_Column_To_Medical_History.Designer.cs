﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using PawledgerAPI.Context;

namespace PawledgerAPI.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20240527220008_2_Add_AddressedTo_Column_To_Medical_History")]
    partial class _2_Add_AddressedTo_Column_To_Medical_History
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 63)
                .HasAnnotation("ProductVersion", "5.0.8")
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            modelBuilder.Entity("PawledgerAPI.Entities.MedicalHistoryEntity", b =>
                {
                    b.Property<long>("MedicalHistoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("AddressedTo")
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedTimestamp")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("EncryptedHistory")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("TokenId")
                        .HasColumnType("text");

                    b.Property<DateTime>("UpdatedTimestamp")
                        .HasColumnType("timestamp without time zone");

                    b.HasKey("MedicalHistoryId");

                    b.ToTable("MedicalHistory");
                });

            modelBuilder.Entity("PawledgerAPI.Entities.PetEntity", b =>
                {
                    b.Property<string>("TokenId")
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedTimestamp")
                        .HasColumnType("timestamp without time zone");

                    b.HasKey("TokenId");

                    b.ToTable("Pet");
                });
#pragma warning restore 612, 618
        }
    }
}
