using System;
using PawledgerAPI.Context;
using PawledgerAPI.Entities;

namespace PawledgerAPI.Repositories
{
  public class PetRepository
  {
    private readonly DataContext _context;

    public PetRepository(DataContext dataContext)
    {
      _context = dataContext;
    }
    public void AddPet(string tokenId)
    {
      var petEntity = new PetEntity
      {
        TokenId = tokenId,
        CreatedTimestamp = DateTime.UtcNow
      };
      _context.Pet.Add(petEntity);
      _context.SaveChanges();
    }
  }
}
