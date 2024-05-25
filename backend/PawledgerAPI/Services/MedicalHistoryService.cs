using PawledgerAPI.Repositories;
using PawledgerAPI.Entities;

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
    }
}
