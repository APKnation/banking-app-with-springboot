package apk.banking.services;

import apk.banking.model.Account;
import apk.banking.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountServiceImp  implements AccountService {
   private final AccountRepository accountRepository;
   public AccountServiceImp(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
   }

     //create method
    @Override
    public Account createAccount(Account account) {
        Account createdAccount = accountRepository.save(account);
        return createdAccount;
    }

    //get method
    @Override
    public List<Account> getAllAccount() {
        return accountRepository.findAll();
    }

    @Override
    public Account getAccountById(Long id) {
        return accountRepository.findById(id).orElse(null);
    }

    //update method
    @Override
    public Account updateAccount(Account account) {
        return null;
    }
     //delete method
    @Override
    public void deleteAccountById(Long id) {
        if (!accountRepository.existsById(id)) {
            throw new RuntimeException("Account not found with id: " + id);
        }
        accountRepository.deleteById(id);
    }


@Override
    public Account deposit(Long id, double amount) {

        Account account = getAccountById(id);

        account.setBalance(account.getBalance() + amount);

        Account savedAccount = accountRepository.save(account);

        return savedAccount;
    }

    @Override
    public Account withdraw(Long id, double amount) {

        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        account.setBalance(account.getBalance() - amount);

        return accountRepository.save(account);
    }
}
