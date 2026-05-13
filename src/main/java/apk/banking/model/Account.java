package apk.banking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@Data
@NoArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountNumber;
    private String cardNumber;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;
    private String accountType; // SAVINGS, CURRENT
    private Double balance;
    private LocalDateTime createdAt;

    public String getAccountOwnerName() {
        return owner != null ? (owner.getFullName() != null ? owner.getFullName() : owner.getUsername()) : "Unknown";
    }
}