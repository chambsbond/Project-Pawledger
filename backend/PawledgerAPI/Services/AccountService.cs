using System.Threading.Tasks;
using PawledgerAPI.Models;
using PawledgerAPI.Repositories;

namespace PawledgerAPI.Services
{
    public class AccountService
    {
        private AccountRepository _accountRepository;

        public AccountService(AccountRepository repository)
        {
            _accountRepository = repository;
        }

        public async Task<AccountModel> GetAccountByAddress(string address) 
        {
            return await _accountRepository.GetAccountByAddress(address);
        }

        public async Task AddAccount(AccountModel model)
        {
            await _accountRepository.AddAccount(model);
        }
    }
}