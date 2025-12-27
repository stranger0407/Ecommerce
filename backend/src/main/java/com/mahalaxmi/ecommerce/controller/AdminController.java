package com.mahalaxmi.ecommerce.controller;

import com.mahalaxmi.ecommerce.dto.DashboardStatsDto;
import com.mahalaxmi.ecommerce.dto.OrderDto;
import com.mahalaxmi.ecommerce.dto.UpdateOrderStatusRequest;
import com.mahalaxmi.ecommerce.dto.UserDto;
import com.mahalaxmi.ecommerce.entity.Order;
import com.mahalaxmi.ecommerce.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for admin operations.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class AdminController {

    private final AdminService adminService;

    /**
     * Get dashboard statistics with analytics.
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        log.info("Getting dashboard statistics");
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    /**
     * Get all orders (paginated).
     */
    @GetMapping("/orders")
    public ResponseEntity<Page<OrderDto>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(adminService.getAllOrders(pageable));
    }

    /**
     * Get orders by status.
     */
    @GetMapping("/orders/status/{status}")
    public ResponseEntity<Page<OrderDto>> getOrdersByStatus(
            @PathVariable Order.OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(adminService.getOrdersByStatus(status, pageable));
    }

    /**
     * Search orders by order number or email.
     */
    @GetMapping("/orders/search")
    public ResponseEntity<Page<OrderDto>> searchOrders(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(adminService.searchOrders(keyword, pageable));
    }

    /**
     * Get order by ID.
     */
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(adminService.getOrderById(orderId));
    }

    /**
     * Update order status.
     */
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody UpdateOrderStatusRequest request) {
        log.info("Updating order {} status to {}", orderId, request.getStatus());
        return ResponseEntity.ok(adminService.updateOrderStatus(orderId, request));
    }

    /**
     * Get all users (paginated).
     */
    @GetMapping("/users")
    public ResponseEntity<Page<UserDto>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(adminService.getAllUsers(pageable));
    }
}
