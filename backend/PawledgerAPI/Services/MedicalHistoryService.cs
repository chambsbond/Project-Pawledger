using PawledgerAPI.Repositories;
using PawledgerAPI.Entities;
using PawledgerAPI.Models;
using System.Threading.Tasks;

namespace PawledgerAPI.Services
{
    public class MedicalHistoryService
    {
        private readonly MedicalHistoryRepository _repository;

        public MedicalHistoryService(MedicalHistoryRepository repository)
        {
            _repository = repository;
        }

        public MedicalHistoryEntity[] GetMedicalHistoryListByTokenId(string tokenId)
        {
            return _repository.GetMedicalHistoriesByTokenId(tokenId);
        }

        public void CreateMedicalHistory(MedicalHistory payload)
        {
            if (!_repository.MedicalHistoryExistsByRequestId(payload.RequestId)) {
                _repository.AddMedicalHistory(payload);
            }
        }
    }
}
