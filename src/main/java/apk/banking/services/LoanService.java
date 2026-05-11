package apk.banking.services;

import apk.banking.model.Loan;
import java.util.List;

public interface LoanService {
    Loan applyForLoan(Loan loan);
    Loan approveLoan(Long loanId);
    Loan rejectLoan(Long loanId);
    Loan makeRepayment(Long loanId, double amount);
    List<Loan> getAllLoans();
    List<Loan> getLoansByAccountId(Long accountId);
}
