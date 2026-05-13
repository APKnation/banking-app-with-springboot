package apk.banking.services;

import apk.banking.model.Account;
import apk.banking.model.Loan;
import apk.banking.model.Transaction;
import apk.banking.repository.AccountRepository;
import apk.banking.repository.LoanRepository;
import apk.banking.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LoanServiceImp implements LoanService {

    private final LoanRepository loanRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public LoanServiceImp(LoanRepository loanRepository, AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.loanRepository = loanRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    public Loan applyForLoan(Loan loan) {
        Account account = accountRepository.findById(loan.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        loan.setAccountOwnerName(account.getAccountOwnerName());
        loan.setStatus("PENDING");
        loan.setAppliedAt(LocalDateTime.now());
        loan.setUpdatedAt(LocalDateTime.now());
        
        // Simple Interest Calculation: Total = Principal + (Principal * Rate * (Months/12))
        double interest = loan.getPrincipalAmount() * loan.getInterestRate() * (loan.getDurationMonths() / 12.0);
        loan.setTotalRepayable(loan.getPrincipalAmount() + interest);
        loan.setMonthlyInstallment(loan.getTotalRepayable() / loan.getDurationMonths());
        loan.setRemainingBalance(loan.getTotalRepayable());
        
        return loanRepository.save(loan);
    }

    @Override
    public Loan approveLoan(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        
        if (!"PENDING".equals(loan.getStatus())) {
            throw new RuntimeException("Loan is not in PENDING status");
        }
        
        Account account = accountRepository.findById(loan.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        // Add loan amount to account balance
        account.setBalance(account.getBalance() + loan.getPrincipalAmount());
        accountRepository.save(account);
        
        // Record transaction
        transactionRepository.save(new Transaction(null, account.getId(), null, account.getAccountOwnerName(), "LOAN_DISBURSEMENT", loan.getPrincipalAmount(), account.getBalance(), "COMPLETED", LocalDateTime.now()));
        
        loan.setStatus("APPROVED");
        loan.setUpdatedAt(LocalDateTime.now());
        return loanRepository.save(loan);
    }

    @Override
    public Loan rejectLoan(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        loan.setStatus("REJECTED");
        loan.setUpdatedAt(LocalDateTime.now());
        return loanRepository.save(loan);
    }

    @Override
    public Loan makeRepayment(Long loanId, double amount) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        
        if (!"APPROVED".equals(loan.getStatus())) {
            throw new RuntimeException("Cannot repay an unapproved loan");
        }
        
        Account account = accountRepository.findById(loan.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance for repayment");
        }
        
        // Deduct from account
        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);
        
        // Record transaction
        transactionRepository.save(new Transaction(null, account.getId(), null, account.getAccountOwnerName(), "LOAN_REPAYMENT", amount, account.getBalance(), "COMPLETED", LocalDateTime.now()));
        
        // Update loan
        loan.setRemainingBalance(Math.max(0, loan.getRemainingBalance() - amount));
        if (loan.getRemainingBalance() <= 0) {
            loan.setStatus("CLOSED");
        }
        loan.setUpdatedAt(LocalDateTime.now());
        
        return loanRepository.save(loan);
    }

    @Override
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    @Override
    public List<Loan> getLoansByAccountId(Long accountId) {
        return loanRepository.findByAccountId(accountId);
    }
}
