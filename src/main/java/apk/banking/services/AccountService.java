package apk.banking.services;

import apk.banking.model.Account;
import java.util.List;

public interface AccountService {

    Account createAccount(Account account);

    Account updateAccount(Account account);

    void deleteAccountById(Long id);

    Account getAccountById(Long id);

    List<Account> getAllAccount();
    Account deposit(Account account, double amount);
    Account withdraw(Account account,Long id, double amount);
}