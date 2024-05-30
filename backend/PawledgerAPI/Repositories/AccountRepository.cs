
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PawledgerAPI.Context;
using PawledgerAPI.Entities;
using PawledgerAPI.Models;

namespace PawledgerAPI.Repositories
{
    public class AccountRepository
    {
        private readonly DataContext _context;

        public AccountRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<AccountModel> GetAccountByAddress(string address) 
        {
            var entity = await _context.AccountEntity.FirstAsync((a) => a.Address.Equals(address));

            return new AccountModel() {
                Address = entity.Address,
                PublicKey = entity.PublicKey
            };
        }

        public async Task AddAccount(AccountModel model)
        {
            await _context.AccountEntity.AddAsync(new AccountEntity {Address = model.Address, PublicKey = model.PublicKey});

            await _context.SaveChangesAsync();
        }
    }
}