
using System;
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
            var entity = await _context.AccountEntity.FirstOrDefaultAsync((a) => a.Address.Equals(address));

            if(entity == null)
                return null;

            return new AccountModel() {
                Address = entity.Address,
                PublicKey = entity.PublicKey
            };
        }

        public async Task AddAccount(AccountModel model)
        {
            await _context.AccountEntity.AddAsync(
                new AccountEntity 
                {
                    Address = model.Address,
                    PublicKey = model.PublicKey,
                    CreatedTimestamp = DateTime.UtcNow,
                    UpdatedTimestamp = DateTime.UtcNow
                });

            await _context.SaveChangesAsync();
        }
    }
}