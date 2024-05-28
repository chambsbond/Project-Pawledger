
namespace PawledgerAPI.Models
{
    public class EncryptedHistory
    {
        public string Iv { get; set; }
        public string EphemPublicKey { get; set; }
        public string Ciphertext { get; set; }
        public string Mac { get; set; }
    }
}
