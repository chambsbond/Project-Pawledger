using System.Linq;
using PawledgerAPI.Context;
using PawledgerAPI.Entities;

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
  }
}
