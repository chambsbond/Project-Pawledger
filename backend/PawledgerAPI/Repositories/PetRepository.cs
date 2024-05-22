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
        public async void AddPet(string tokenId)
        {
            var petEntity = new PetEntity();
            petEntity.TokenId = tokenId;
            _context.Pet.Add(petEntity);
            _context.SaveChanges();
        }
    }

    
}
