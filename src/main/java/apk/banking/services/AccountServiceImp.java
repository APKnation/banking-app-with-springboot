package apk.banking.services;

import apk.banking.model.Account;
import apk.banking.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountServiceImp  implements AccountService {
   private AccountRepository accountRepository;
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
      //update method
    @Override
    public Account updateAccount(Account account) {
        return null;
    }
     //delete method
    @Override
    public void deleteAccountById(Long id) {

    }

    @Override
    public Account getAccountById(Long id) {
        return accountRepository.findById(id).orElse(null);
    }

  @Override
    public Account deposit(Account account,Long id,  double amount) {
       Account depositedAccount = deposit(account,id,amount);
       double total = depositedAccount.getBalance()+amount;
       depositedAccount.setBalance(total);
       Account savedAccount=accountRepository.save(depositedAccount);
       return depositedAccount;
  }
}
