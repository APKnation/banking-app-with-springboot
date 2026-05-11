package apk.banking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long accountId;
    private String accountOwnerName;
    private Double principalAmount;
    private Double interestRate; // e.g. 0.05 for 5%
    private int durationMonths;
    private Double totalRepayable;
    private Double monthlyInstallment;
    private Double remainingBalance;
    
    private String status; // PENDING, APPROVED, REJECTED, CLOSED
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
