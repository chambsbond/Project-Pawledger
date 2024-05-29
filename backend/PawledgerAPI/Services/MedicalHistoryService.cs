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

    public MedicalHistoryEntity[] GetMedicalHistoryListByTokenId(string tokenId, string addressTo)
    {
      return _repository.GetMedicalHistoriesByTokenId(tokenId, addressTo);
    }

    public void CreateMedicalHistories(MedicalHistory[] payloads)
    {
      lock (payloads[0].RequestId)
      {
        foreach (var payload in payloads)
        {
          if (!_repository.MedicalHistoryExistsByRequestId(payload.RequestId))
          {
            _repository.AddMedicalHistory(payload);
          }
        }
      }
    }
  }
}
