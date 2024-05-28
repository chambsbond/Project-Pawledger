using System;
using System.Linq;
using System.Text.Json;
using PawledgerAPI.Context;
using PawledgerAPI.Entities;
using PawledgerAPI.Models;

namespace PawledgerAPI.Repositories
{
  public class MedicalHistoryRepository
  {
    private readonly DataContext _context;

    public MedicalHistoryRepository(DataContext dataContext)
    {
      _context = dataContext;
    }

    public MedicalHistoryEntity[] GetMedicalHistoriesByTokenId(string tokenId)
    {
      return _context.MedicalHistory
        .Where(m => m.TokenId == tokenId)
        .ToArray();
    }

    public bool MedicalHistoryExistsByRequestId(string requestId)
    {
      return _context.MedicalHistory
        .Where(m => m.RequestId == requestId)
        .Count() > 0;
    }

    public void AddMedicalHistory(MedicalHistory history)
    {
      var entity = new MedicalHistoryEntity
      {
        TokenId = history.TokenId,
        EncryptedHistory = JsonSerializer.Serialize(history.EncryptedHistory),
        AddressedTo = history.AddressedTo,
        RequestId = history.RequestId,
        CreatedTimestamp = DateTime.UtcNow,
        UpdatedTimestamp = DateTime.UtcNow
      };
      
      _context.MedicalHistory.Add(entity);
      _context.SaveChanges();
    }
  }
}
