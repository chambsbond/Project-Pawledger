
using Microsoft.EntityFrameworkCore;
using PawledgerAPI.Entities;

namespace PawledgerAPI.Context
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<PetEntity> Pet { get; set; }
        public DbSet<MedicalHistoryEntity> MedicalHistory { get; set; }

    }
}
