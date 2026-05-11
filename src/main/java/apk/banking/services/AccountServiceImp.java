package apk.banking.services;

import apk.banking.model.Account;
import apk.banking.repository.AccountRepository;
import apk.banking.model.Transaction;
import apk.banking.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AccountServiceImp implements AccountService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public AccountServiceImp(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    public Account createAccount(Account account) {
        // Generate a simple unique account number
        account.setAccountNumber("ACC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        account.setCreatedAt(LocalDateTime.now());
        if (account.getAccountType() == null) account.setAccountType("SAVINGS");
        return accountRepository.save(account);
    }

    @Override
    public List<Account> getAllAccount() {
        return accountRepository.findAll();
    }

    @Override
    public Account getAccountById(Long id) {
        return accountRepository.findById(id).orElse(null);
    }

    @Override
    public Account updateAccount(Account account) {
        return accountRepository.save(account);
    }

    @Override
    public void deleteAccountById(Long id) {
        if (!accountRepository.existsById(id)) {
            throw new RuntimeException("Account not found with id: " + id);
        }
        accountRepository.deleteById(id);
    }

    @Override
    public Account deposit(Long id, double amount) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setBalance(account.getBalance() + amount);
        Account updated = accountRepository.save(account);

        transactionRepository.save(new Transaction(null, id, account.getAccountOwnerName(), "DEPOSIT", amount, updated.getBalance(), LocalDateTime.now()));

        return updated;
    }

    @Override
    public Account withdraw(Long id, double amount) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        account.setBalance(account.getBalance() - amount);
        Account updated = accountRepository.save(account);

        transactionRepository.save(new Transaction(null, id, account.getAccountOwnerName(), "WITHDRAW", amount, updated.getBalance(), LocalDateTime.now()));

        return updated;
    }

    @Override
    public void transfer(Long fromId, Long toId, double amount) {
        Account fromAccount = accountRepository.findById(fromId)
                .orElseThrow(() -> new RuntimeException("Source account not found"));
        Account toAccount = accountRepository.findById(toId)
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        if (fromAccount.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance for transfer");
        }

        // Deduct from source
        fromAccount.setBalance(fromAccount.getBalance() - amount);
        Account updatedFrom = accountRepository.save(fromAccount);
        transactionRepository.save(new Transaction(null, fromId, fromAccount.getAccountOwnerName(), "TRANSFER_OUT", amount, updatedFrom.getBalance(), LocalDateTime.now()));

        // Add to destination
        toAccount.setBalance(toAccount.getBalance() + amount);
        Account updatedTo = accountRepository.save(toAccount);
        transactionRepository.save(new Transaction(null, toId, toAccount.getAccountOwnerName(), "TRANSFER_IN", amount, updatedTo.getBalance(), LocalDateTime.now()));
    }
}
