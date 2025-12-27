package com.mahalaxmi.ecommerce.repository;

import com.mahalaxmi.ecommerce.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Order entity operations.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    /**
     * Find an order by order number.
     *
     * @param orderNumber the order number
     * @return Optional containing the order if found
     */
    Optional<Order> findByOrderNumber(String orderNumber);
    
    /**
     * Find all orders for a specific user.
     *
     * @param userId the user ID
     * @param pageable pagination information
     * @return page of user orders
     */
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    /**
     * Find all orders (admin view).
     *
     * @param pageable pagination information
     * @return page of all orders
     */
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    /**
     * Find orders by status.
     *
     * @param status the order status
     * @param pageable pagination information
     * @return page of orders with the specified status
     */
    Page<Order> findByStatusOrderByCreatedAtDesc(Order.OrderStatus status, Pageable pageable);
    
    /**
     * Count orders by status.
     */
    long countByStatus(Order.OrderStatus status);
    
    /**
     * Count orders created after a specific date.
     */
    long countByCreatedAtAfter(LocalDateTime dateTime);
    
    /**
     * Sum total revenue for orders with PAID payment status.
     */
    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.paymentStatus = 'PAID'")
    BigDecimal sumTotalRevenue();
    
    /**
     * Sum revenue after a specific date.
     */
    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.paymentStatus = 'PAID' AND o.createdAt >= :startDate")
    BigDecimal sumRevenueAfter(@Param("startDate") LocalDateTime startDate);
    
    /**
     * Count orders between dates.
     */
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    /**
     * Sum revenue between dates.
     */
    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.paymentStatus = 'PAID' AND o.createdAt BETWEEN :start AND :end")
    BigDecimal sumRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    /**
     * Find recent orders for dashboard.
     */
    List<Order> findTop10ByOrderByCreatedAtDesc();
    
    /**
     * Search orders by order number or user email.
     */
    @Query("SELECT o FROM Order o WHERE o.orderNumber LIKE %:keyword% OR o.user.email LIKE %:keyword%")
    Page<Order> searchOrders(@Param("keyword") String keyword, Pageable pageable);
}

