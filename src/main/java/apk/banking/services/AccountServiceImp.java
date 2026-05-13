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
        String ownerName = account.getAccountOwnerName();
        transactionRepository.save(new Transaction(null, id, null, ownerName, "DEPOSIT", amount, updated.getBalance(), "COMPLETED", LocalDateTime.now()));
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
        String ownerName = account.getAccountOwnerName();
        transactionRepository.save(new Transaction(null, id, null, ownerName, "WITHDRAW", amount, updated.getBalance(), "COMPLETED", LocalDateTime.now()));
        return updated;
    }

    @Override
    public void transfer(Long fromId, Long toId, double amount) {
        Account fromAccount = accountRepository.findById(fromId)
                .orElseThrow(() -> new RuntimeException("Source account not found"));
        accountRepository.findById(toId)
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        if (fromAccount.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance for transfer");
        }

        String ownerName = fromAccount.getAccountOwnerName();
        // Create PENDING transaction for approval
        transactionRepository.save(new Transaction(
            null, 
            fromId, 
            toId, 
            ownerName, 
            "TRANSFER_OUT", 
            amount, 
            fromAccount.getBalance(), 
            "PENDING", 
            LocalDateTime.now()
        ));
    }

    @Override
    public void approveTransfer(Long transactionId) {
        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!"PENDING".equals(tx.getStatus())) {
            throw new RuntimeException("Transaction is not in PENDING state");
        }

        Account fromAccount = accountRepository.findById(tx.getAccountId())
                .orElseThrow(() -> new RuntimeException("Source account not found"));
        Account toAccount = accountRepository.findById(tx.getTargetAccountId())
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        if (fromAccount.getBalance() < tx.getAmount()) {
            tx.setStatus("REJECTED");
            transactionRepository.save(tx);
            throw new RuntimeException("Insufficient balance at time of approval");
        }

        // Deduct from source
        fromAccount.setBalance(fromAccount.getBalance() - tx.getAmount());
        accountRepository.save(fromAccount);
        
        // Update source transaction
        tx.setStatus("COMPLETED");
        tx.setBalanceAfterTransaction(fromAccount.getBalance());
        tx.setTimestamp(LocalDateTime.now());
        transactionRepository.save(tx);

        // Add to destination
        toAccount.setBalance(toAccount.getBalance() + tx.getAmount());
        accountRepository.save(toAccount);
        
        String ownerName = toAccount.getAccountOwnerName();
        // Create matching TRANSFER_IN for recipient
        transactionRepository.save(new Transaction(
            null, 
            toAccount.getId(), 
            fromAccount.getId(), 
            ownerName, 
            "TRANSFER_IN", 
            tx.getAmount(), 
            toAccount.getBalance(), 
            "COMPLETED", 
            LocalDateTime.now()
        ));
    }

    @Override
    public void rejectTransfer(Long transactionId) {
        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        tx.setStatus("REJECTED");
        tx.setTimestamp(LocalDateTime.now());
        transactionRepository.save(tx);
    }

    @Override
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
