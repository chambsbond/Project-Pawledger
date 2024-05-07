using System.ComponentModel.DataAnnotations;

namespace PawledgerAPI.Entities
{
    public class PetEntity
    {
        [Key]
        public string TokenId { get; set; }
    }
}
