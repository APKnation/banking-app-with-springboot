package apk.banking.services;

import apk.banking.model.Account;
import apk.banking.repository.AccountRepository;
import org.springframework.stereotype.Service;

@Service
public class AccountServiceImp  implements AccountService {
   private AccountRepository accountRepository;
   public AccountServiceImp(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
   }
    @Override
    public Account createAccount(Account account) {
        Account createdAccount = accountRepository.save(account);
        return createdAccount;
    }

    @Override
    public Account findAccountById(Long id) {
        return null;
    }

    @Override
    public Account updateAccount(Account account) {
        return null;
    }

    @Override
    public void deleteAccountById(Long id) {

    }
}
