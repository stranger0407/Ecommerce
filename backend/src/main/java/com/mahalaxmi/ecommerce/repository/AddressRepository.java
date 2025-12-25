package com.mahalaxmi.ecommerce.repository;

import com.mahalaxmi.ecommerce.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Address entity operations.
 */
@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    
    /**
     * Find all addresses for a specific user.
     *
     * @param userId the user ID
     * @return list of user addresses
     */
    List<Address> findByUserId(Long userId);
    
    /**
     * Find the default address for a user.
     *
     * @param userId the user ID
     * @return Optional containing the default address if found
     */
    Optional<Address> findByUserIdAndIsDefaultTrue(Long userId);
}
