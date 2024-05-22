
using System;
using System.ComponentModel.DataAnnotations;

namespace PawledgerAPI.Entities
{
    public class MedicalHistoryEntity
    {
        public string TokenId { get; set; }
        [Key]
        public string MedicalHistoryId { get; set; }
        public string ResponseBytes { get; set; }
        public DateTime CreatedTs { get; set; }

        public virtual PetEntity Pet { get; set; }
    }
}
