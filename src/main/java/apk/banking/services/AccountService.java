package apk.banking.services;

import apk.banking.model.Account;
import apk.banking.model.Transaction;
import java.util.List;

public interface AccountService {

    Account createAccount(Account account);


    Account updateAccount(Account account);

    void deleteAccountById(Long id);

    Account getAccountById(Long id);

    List<Account> getAllAccount();
    Account deposit(Long id, double amount);
    Account withdraw(Long id, double amount);
    void transfer(Long fromId, Long toId, double amount);
    void approveTransfer(Long transactionId);
    void rejectTransfer(Long transactionId);
    List<Transaction> getAllTransactions();
}