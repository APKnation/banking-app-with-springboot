package apk.banking.controller;

import apk.banking.dto.DepositRequest;
import apk.banking.model.Account;
import apk.banking.repository.AccountRepository;
import apk.banking.services.AccountService;

import apk.banking.model.User;
import apk.banking.model.Role;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/account")
@CrossOrigin(origins = "*")
public class AccountController {
    private final AccountService accountService;
    private final AccountRepository accountRepository;

    public AccountController(AccountService accountService, AccountRepository accountRepository) {
        this.accountService = accountService;
        this.accountRepository = accountRepository;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TELLER', 'CUSTOMER')")
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        account.setOwner(currentUser);

        Account createdAccount = accountService.createAccount(account);
        return ResponseEntity.ok(createdAccount);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'TELLER', 'CUSTOMER')")
    public ResponseEntity<List<Account>>getAllAccounts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        List<Account> accounts;
        
        if (currentUser.getRole() == Role.CUSTOMER) {
            accounts = accountService.getAccountsByUserId(currentUser.getId());
        } else {
            accounts = accountService.getAllAccount();
        }
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'TELLER', 'CUSTOMER')")
    public ResponseEntity<Account> getAccountById(@PathVariable Long id) {
        Account account = accountService.getAccountById(id);
        return ResponseEntity.ok(account);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Account> updateAccount(@RequestBody Account account) {
        Account updatedAccount = accountService.updateAccount(account);
        return ResponseEntity.ok(updatedAccount);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccountById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/deposit")
    @PreAuthorize("hasAnyRole('ADMIN', 'TELLER')")
    public ResponseEntity<Account> deposit(
            @PathVariable Long id,
            @RequestBody DepositRequest request) {

        Account account = accountService.deposit(id, request.getAmount());
        return ResponseEntity.ok(account);
    }

    @PutMapping("/{id}/withdraw")
    @PreAuthorize("hasAnyRole('ADMIN', 'TELLER')")
    public ResponseEntity<Account> withdraw(
            @PathVariable Long id,
            @RequestBody DepositRequest request) {
        Account account = accountService.withdraw(id, request.getAmount());
        return ResponseEntity.ok(account);
    }

    @PutMapping("/{id}/transfer")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN', 'TELLER')")
    public ResponseEntity<Void> transfer(
            @PathVariable Long id,
            @RequestBody apk.banking.dto.TransferRequest request) {
        accountService.transfer(id, request.getToAccountId(), request.getAmount());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/transactions/{id}/approve")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Void> approveTransfer(@PathVariable Long id) {
        accountService.approveTransfer(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/transactions/{id}/reject")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Void> rejectTransfer(@PathVariable Long id) {
        accountService.rejectTransfer(id);
        return ResponseEntity.ok().build();
    }
}
