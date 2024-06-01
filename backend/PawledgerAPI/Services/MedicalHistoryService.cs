using PawledgerAPI.Repositories;
using PawledgerAPI.Entities;
using PawledgerAPI.Models;

namespace PawledgerAPI.Services
{
  public class MedicalHistoryService
  {
    private readonly MedicalHistoryRepository _repository;

    public MedicalHistoryService(MedicalHistoryRepository repository)
    {
      _repository = repository;
    }

    public MedicalHistoryEntity[] GetMedicalHistoryListByTokenId(string tokenId, string addressTo)
    {
      return _repository.GetMedicalHistoriesByTokenId(tokenId, addressTo);
    }

    public void CreateMedicalHistories(MedicalHistory[] payloads)
    {
      string requestId = payloads[0].RequestId;
      lock (requestId)
      {
        if (!_repository.MedicalHistoryExistsByRequestId(requestId))
        {
          foreach (var payload in payloads)
          {
            _repository.AddMedicalHistory(payload);
          }
        }
      }
    }
  }
}
