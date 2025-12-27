package com.mahalaxmi.ecommerce.service;

import com.mahalaxmi.ecommerce.dto.DashboardStatsDto;
import com.mahalaxmi.ecommerce.dto.OrderDto;
import com.mahalaxmi.ecommerce.dto.UpdateOrderStatusRequest;
import com.mahalaxmi.ecommerce.dto.UserDto;
import com.mahalaxmi.ecommerce.entity.Order;
import com.mahalaxmi.ecommerce.entity.OrderItem;
import com.mahalaxmi.ecommerce.entity.User;
import com.mahalaxmi.ecommerce.exception.ResourceNotFoundException;
import com.mahalaxmi.ecommerce.repository.CategoryRepository;
import com.mahalaxmi.ecommerce.repository.OrderRepository;
import com.mahalaxmi.ecommerce.repository.ProductRepository;
import com.mahalaxmi.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for admin operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final OrderService orderService;

    /**
     * Get dashboard statistics with analytics.
     */
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        
        // Basic counts
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();
        
        // Today's stats
        long ordersToday = orderRepository.countByCreatedAtAfter(startOfToday);
        BigDecimal revenueToday = orderRepository.sumRevenueAfter(startOfToday);
        
        // This month stats
        long ordersThisMonth = orderRepository.countByCreatedAtAfter(startOfMonth);
        BigDecimal revenueThisMonth = orderRepository.sumRevenueAfter(startOfMonth);
        
        // Orders by status
        Map<String, Long> ordersByStatus = new LinkedHashMap<>();
        for (Order.OrderStatus status : Order.OrderStatus.values()) {
            ordersByStatus.put(status.name(), orderRepository.countByStatus(status));
        }
        
        // Daily sales for last 7 days
        List<DashboardStatsDto.DailySalesDto> dailySales = getDailySales(7);
        
        // Top selling products
        List<DashboardStatsDto.TopProductDto> topProducts = getTopProducts(5);
        
        // Sales by category
        Map<String, BigDecimal> salesByCategory = getSalesByCategory();
        
        return DashboardStatsDto.builder()
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalUsers(totalUsers)
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .ordersToday(ordersToday)
                .revenueToday(revenueToday != null ? revenueToday : BigDecimal.ZERO)
                .ordersThisMonth(ordersThisMonth)
                .revenueThisMonth(revenueThisMonth != null ? revenueThisMonth : BigDecimal.ZERO)
                .ordersByStatus(ordersByStatus)
                .dailySales(dailySales)
                .topProducts(topProducts)
                .salesByCategory(salesByCategory)
                .build();
    }
    
    /**
     * Get daily sales data for the last N days.
     */
    private List<DashboardStatsDto.DailySalesDto> getDailySales(int days) {
        List<DashboardStatsDto.DailySalesDto> result = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
        
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
            
            long orders = orderRepository.countByCreatedAtBetween(startOfDay, endOfDay);
            BigDecimal revenue = orderRepository.sumRevenueBetween(startOfDay, endOfDay);
            
            result.add(DashboardStatsDto.DailySalesDto.builder()
                    .date(date.format(formatter))
                    .orders(orders)
                    .revenue(revenue != null ? revenue : BigDecimal.ZERO)
                    .build());
        }
        
        return result;
    }
    
    /**
     * Get top selling products.
     */
    private List<DashboardStatsDto.TopProductDto> getTopProducts(int limit) {
        List<Order> allOrders = orderRepository.findAll();
        Map<Long, DashboardStatsDto.TopProductDto> productSales = new HashMap<>();
        
        for (Order order : allOrders) {
            if (order.getPaymentStatus() == Order.PaymentStatus.PAID) {
                for (OrderItem item : order.getItems()) {
                    Long productId = item.getProduct().getId();
                    DashboardStatsDto.TopProductDto existing = productSales.get(productId);
                    
                    if (existing == null) {
                        productSales.put(productId, DashboardStatsDto.TopProductDto.builder()
                                .productId(productId)
                                .productName(item.getProduct().getName())
                                .quantitySold(item.getQuantity())
                                .totalRevenue(item.getSubtotal())
                                .build());
                    } else {
                        productSales.put(productId, DashboardStatsDto.TopProductDto.builder()
                                .productId(productId)
                                .productName(existing.getProductName())
                                .quantitySold(existing.getQuantitySold() + item.getQuantity())
                                .totalRevenue(existing.getTotalRevenue().add(item.getSubtotal()))
                                .build());
                    }
                }
            }
        }
        
        return productSales.values().stream()
                .sorted((a, b) -> Long.compare(b.getQuantitySold(), a.getQuantitySold()))
                .limit(limit)
                .collect(Collectors.toList());
    }
    
    /**
     * Get sales breakdown by category.
     */
    private Map<String, BigDecimal> getSalesByCategory() {
        List<Order> allOrders = orderRepository.findAll();
        Map<String, BigDecimal> salesByCategory = new LinkedHashMap<>();
        
        for (Order order : allOrders) {
            if (order.getPaymentStatus() == Order.PaymentStatus.PAID) {
                for (OrderItem item : order.getItems()) {
                    String categoryName = item.getProduct().getCategory() != null 
                            ? item.getProduct().getCategory().getName() 
                            : "Uncategorized";
                    salesByCategory.merge(categoryName, item.getSubtotal(), BigDecimal::add);
                }
            }
        }
        
        return salesByCategory;
    }
    
    /**
     * Get all orders for admin view.
     */
    @Transactional(readOnly = true)
    public Page<OrderDto> getAllOrders(Pageable pageable) {
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::convertToOrderDto);
    }
    
    /**
     * Get orders by status.
     */
    @Transactional(readOnly = true)
    public Page<OrderDto> getOrdersByStatus(Order.OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                .map(this::convertToOrderDto);
    }
    
    /**
     * Search orders by order number or email.
     */
    @Transactional(readOnly = true)
    public Page<OrderDto> searchOrders(String keyword, Pageable pageable) {
        return orderRepository.searchOrders(keyword, pageable)
                .map(this::convertToOrderDto);
    }
    
    /**
     * Update order status.
     */
    @Transactional
    public OrderDto updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(request.getStatus());
        order.setStatus(newStatus);
        
        if (request.getTrackingNumber() != null) {
            order.setTrackingNumber(request.getTrackingNumber());
        }
        
        if (request.getNotes() != null) {
            order.setNotes(request.getNotes());
        }
        
        // Update timestamps based on status
        if (newStatus == Order.OrderStatus.SHIPPED && order.getShippedAt() == null) {
            order.setShippedAt(LocalDateTime.now());
        } else if (newStatus == Order.OrderStatus.DELIVERED && order.getDeliveredAt() == null) {
            order.setDeliveredAt(LocalDateTime.now());
        }
        
        Order savedOrder = orderRepository.save(order);
        log.info("Updated order {} status to {}", orderId, newStatus);
        
        return convertToOrderDto(savedOrder);
    }
    
    /**
     * Get all users.
     */
    @Transactional(readOnly = true)
    public Page<UserDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::convertToUserDto);
    }
    
    /**
     * Get order by ID (admin view - any order).
     */
    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return convertToOrderDto(order);
    }
    
    private OrderDto convertToOrderDto(Order order) {
        return orderService.convertToDto(order);
    }
    
    private UserDto convertToUserDto(User user) {
        long totalOrders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), Pageable.unpaged()).getTotalElements();
        
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .totalOrders(totalOrders)
                .build();
    }
}
