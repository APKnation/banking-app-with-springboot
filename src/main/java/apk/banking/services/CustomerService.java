package apk.banking.services;

import apk.banking.model.Role;
import apk.banking.model.User;
import apk.banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createCustomer(User customer) {
        customer.setRole(Role.CUSTOMER);
        // Default password if not provided
        if (customer.getPassword() == null || customer.getPassword().isEmpty()) {
            customer.setPassword(passwordEncoder.encode("Welcome@123"));
        } else {
            customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        }
        customer.setActive(true);
        return userRepository.save(customer);
    }

    public User updateCustomer(Long id, User customerDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        user.setFullName(customerDetails.getFullName());
        user.setEmail(customerDetails.getEmail());
        user.setNationalId(customerDetails.getNationalId());
        user.setAddress(customerDetails.getAddress());
        user.setPhoneNumber(customerDetails.getPhoneNumber());
        
        return userRepository.save(user);
    }

    public void deactivateCustomer(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        user.setActive(false);
        userRepository.save(user);
    }

    public void activateCustomer(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        user.setActive(true);
        userRepository.save(user);
    }

    public List<User> getAllCustomers() {
        return userRepository.findByRole(Role.CUSTOMER);
    }

    public List<User> searchCustomers(String query) {
        return userRepository.searchCustomers(query).stream()
                .filter(u -> u.getRole() == Role.CUSTOMER)
                .collect(Collectors.toList());
    }

    public User getCustomerById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        if (user.getRole() != Role.CUSTOMER) {
            throw new RuntimeException("User is not a customer");
        }
        return user;
    }
}
