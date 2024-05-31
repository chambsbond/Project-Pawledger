using System.Text.Json.Serialization;

namespace PawledgerAPI.Models
{
    public class EncryptedHistory
    {
        [JsonPropertyName("iv")]
        public string Iv { get; set; }
        [JsonPropertyName("ephemPublicKey")]
        public string EphemPublicKey { get; set; }
        [JsonPropertyName("ciphertext")]
        public string Ciphertext { get; set; }
        [JsonPropertyName("mac")]
        public string Mac { get; set; }
    }
}
