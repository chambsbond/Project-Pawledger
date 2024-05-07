
namespace PawledgerAPI.Entities
{
    public class MedicalHistoryEntity
    {
        public string TokenId { get; set; }
        public string MedicalHistoryId { get; set; }
        public string EventType { get; set; }
        public string EventValue { get; set; }

        public virtual PetEntity Pet { get; set; }
    }
}
