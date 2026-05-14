package apk.banking.controller;

import apk.banking.model.Transaction;
import apk.banking.repository.TransactionRepository;
import apk.banking.repository.TransactionSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Collections;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionRepository transactionRepository;

    public TransactionController(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'TELLER', 'CUSTOMER')")
    public ResponseEntity<List<Transaction>> getAllTransactions(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Double minAmount,
            @RequestParam(required = false) Double maxAmount,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) Long accountId
    ) {
        Specification<Transaction> spec = Specification.where(TransactionSpecification.hasType(type))
                .and(TransactionSpecification.hasAmountGreaterThan(minAmount))
                .and(TransactionSpecification.hasAmountLessThan(maxAmount))
                .and(TransactionSpecification.isBetweenDates(startDate, endDate))
                .and(TransactionSpecification.hasAccountId(accountId));

        List<Transaction> transactions = transactionRepository.findAll(spec);
        Collections.reverse(transactions);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/account/{accountId}/mini-statement")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'TELLER', 'CUSTOMER')")
    public ResponseEntity<List<Transaction>> getMiniStatement(@PathVariable Long accountId) {
        List<Transaction> transactions = transactionRepository.findTop10ByAccountIdOrderByTimestampDesc(accountId);
        return ResponseEntity.ok(transactions);
    }
}
