package apk.banking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long accountId;
    private String accountOwnerName;
    private String type; 
    private Double amount;
    private Double balanceAfterTransaction;
    private String status; // COMPLETED, PENDING, FAILED
    private LocalDateTime timestamp;
}
