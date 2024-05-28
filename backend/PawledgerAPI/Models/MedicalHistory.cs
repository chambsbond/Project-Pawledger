
namespace PawledgerAPI.Models
{
    public class MedicalHistory
    {
        public string TokenId { get; set; }
        public EncryptedHistory EncryptedHistory { get; set; }
        public string AddressedTo { get; set; }
        public string RequestId { get; set; }
    }
}
