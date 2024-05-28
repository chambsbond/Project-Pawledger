using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PawledgerAPI.Entities
{
    public class MedicalHistoryEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long MedicalHistoryId { get; set; }
        [ForeignKey("PetEntity")]
        public string TokenId { get; set; }
        [Required]
        public string EncryptedHistory { get; set; }
        public string AddressedTo { get; set; }
        [Required]
        public string RequestId { get; set; }
        public DateTime CreatedTimestamp { get; set; }
        public DateTime UpdatedTimestamp { get; set; }
    }
}
