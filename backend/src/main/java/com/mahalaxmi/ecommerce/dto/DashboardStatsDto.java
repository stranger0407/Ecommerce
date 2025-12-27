package com.mahalaxmi.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * DTO for dashboard statistics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    
    private long totalProducts;
    private long totalOrders;
    private long totalUsers;
    private BigDecimal totalRevenue;
    
    // Today's stats
    private long ordersToday;
    private BigDecimal revenueToday;
    
    // This month stats
    private long ordersThisMonth;
    private BigDecimal revenueThisMonth;
    
    // Order status breakdown
    private Map<String, Long> ordersByStatus;
    
    // Recent trends (last 7 days)
    private List<DailySalesDto> dailySales;
    
    // Top selling products
    private List<TopProductDto> topProducts;
    
    // Category-wise sales
    private Map<String, BigDecimal> salesByCategory;
    
    /**
     * Daily sales data point.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailySalesDto {
        private String date;
        private long orders;
        private BigDecimal revenue;
    }
    
    /**
     * Top selling product summary.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopProductDto {
        private Long productId;
        private String productName;
        private long quantitySold;
        private BigDecimal totalRevenue;
    }
}
