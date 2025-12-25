package com.mahalaxmi.ecommerce.controller;

import com.mahalaxmi.ecommerce.dto.CreateOrderRequest;
import com.mahalaxmi.ecommerce.dto.OrderDto;
import com.mahalaxmi.ecommerce.entity.User;
import com.mahalaxmi.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for order operations.
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;

    /**
     * Create a new order from the user's cart.
     */
    @PostMapping
    public ResponseEntity<OrderDto> createOrder(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateOrderRequest request) {
        log.info("Creating order for user: {}", user.getEmail());
        OrderDto order = orderService.createOrder(user.getId(), request);
        return ResponseEntity.ok(order);
    }

    /**
     * Get all orders for the authenticated user.
     */
    @GetMapping
    public ResponseEntity<Page<OrderDto>> getUserOrders(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderDto> orders = orderService.getUserOrders(user.getId(), pageable);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get a specific order by ID.
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrderById(
            @AuthenticationPrincipal User user,
            @PathVariable Long orderId) {
        OrderDto order = orderService.getOrderById(user.getId(), orderId);
        return ResponseEntity.ok(order);
    }

    /**
     * Get order by order number.
     */
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderDto> getOrderByNumber(
            @AuthenticationPrincipal User user,
            @PathVariable String orderNumber) {
        OrderDto order = orderService.getOrderByNumber(user.getId(), orderNumber);
        return ResponseEntity.ok(order);
    }
}
