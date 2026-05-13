package apk.banking.controller;

import apk.banking.model.Loan;
import apk.banking.services.LoanService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping("/apply")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN', 'TELLER')")
    public ResponseEntity<Loan> applyForLoan(@RequestBody Loan loan) {
        return ResponseEntity.ok(loanService.applyForLoan(loan));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Loan> approveLoan(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.approveLoan(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Loan> rejectLoan(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.rejectLoan(id));
    }

    @PutMapping("/{id}/repay")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN', 'TELLER')")
    public ResponseEntity<Loan> makeRepayment(@PathVariable Long id, @RequestBody java.util.Map<String, Double> payload) {
        double amount = payload.get("amount");
        return ResponseEntity.ok(loanService.makeRepayment(id, amount));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'TELLER')")
    public ResponseEntity<List<Loan>> getAllLoans() {
        return ResponseEntity.ok(loanService.getAllLoans());
    }

    @GetMapping("/account/{accountId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'TELLER', 'CUSTOMER')")
    public ResponseEntity<List<Loan>> getLoansByAccountId(@PathVariable Long accountId) {
        return ResponseEntity.ok(loanService.getLoansByAccountId(accountId));
    }
}
