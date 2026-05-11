package apk.banking.dto;

import lombok.Data;

@Data
public class TransferRequest {
    private Long toAccountId;
    private Double amount;
}
