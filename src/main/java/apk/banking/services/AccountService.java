package apk.banking.services;

import apk.banking.model.Account;

public interface AccountService {
    Account createAccount(Account account);
    Account findAccountById(Long id);
    Account updateAccount(Account account);
    void deleteAccountById(Long id);
}
