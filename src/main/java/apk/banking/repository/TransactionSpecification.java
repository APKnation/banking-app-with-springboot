package apk.banking.repository;

import apk.banking.model.Transaction;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDateTime;

public class TransactionSpecification {

    public static Specification<Transaction> hasType(String type) {
        return (root, query, cb) -> type == null ? null : cb.equal(root.get("type"), type);
    }

    public static Specification<Transaction> hasAmountGreaterThan(Double amount) {
        return (root, query, cb) -> amount == null ? null : cb.greaterThanOrEqualTo(root.get("amount"), amount);
    }

    public static Specification<Transaction> hasAmountLessThan(Double amount) {
        return (root, query, cb) -> amount == null ? null : cb.lessThanOrEqualTo(root.get("amount"), amount);
    }

    public static Specification<Transaction> isBetweenDates(LocalDateTime start, LocalDateTime end) {
        return (root, query, cb) -> {
            if (start == null && end == null) return null;
            if (start != null && end == null) return cb.greaterThanOrEqualTo(root.get("timestamp"), start);
            if (start == null && end != null) return cb.lessThanOrEqualTo(root.get("timestamp"), end);
            return cb.between(root.get("timestamp"), start, end);
        };
    }
    
    public static Specification<Transaction> hasAccountId(Long accountId) {
        return (root, query, cb) -> accountId == null ? null : cb.equal(root.get("accountId"), accountId);
    }
}
