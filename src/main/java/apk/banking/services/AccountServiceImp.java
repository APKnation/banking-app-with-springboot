package apk.banking.services;

import apk.banking.model.Account;
import apk.banking.repository.AccountRepository;
import apk.banking.model.Transaction;
import apk.banking.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import java.util.List;

@Service
public class AccountServiceImp  implements AccountService {
   private final AccountRepository accountRepository;
   private final TransactionRepository transactionRepository;

   public AccountServiceImp(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
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
        
        transactionRepository.save(new Transaction(null, id, account.getAccountOwnerName(), "DEPOSIT", amount, LocalDateTime.now()));

        return accountRepository.save(account);
    }

    @Override
    public Account withdraw(Long id, double amount) {

        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        account.setBalance(account.getBalance() - amount);
        
        transactionRepository.save(new Transaction(null, id, account.getAccountOwnerName(), "WITHDRAW", amount, LocalDateTime.now()));

        return accountRepository.save(account);
    }
}
