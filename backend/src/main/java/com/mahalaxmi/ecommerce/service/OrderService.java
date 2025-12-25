package com.mahalaxmi.ecommerce.service;

import com.mahalaxmi.ecommerce.dto.*;
import com.mahalaxmi.ecommerce.entity.*;
import com.mahalaxmi.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for order management.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    /**
     * Create a new order from the user's cart.
     */
    @Transactional
    public OrderDto createOrder(Long userId, CreateOrderRequest request) {
        log.info("Creating order for user: {}", userId);

        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get user's cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Create or get shipping address
        Address shippingAddress = createAddress(user, request.getShippingAddress());
        addressRepository.save(shippingAddress);

        // Calculate totals
        BigDecimal subtotal = cart.getItems().stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal shippingCost = calculateShippingCost(subtotal, request.getShippingMethod());
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.18)); // 18% GST
        BigDecimal total = subtotal.add(shippingCost).add(tax);

        // Create order
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .user(user)
                .subtotal(subtotal)
                .tax(tax)
                .shippingCost(shippingCost)
                .total(total)
                .status(Order.OrderStatus.PENDING)
                .paymentStatus(Order.PaymentStatus.PENDING)
                .paymentMethod(Order.PaymentMethod.valueOf(request.getPaymentMethod()))
                .shippingAddress(shippingAddress)
                .billingAddress(shippingAddress)
                .notes(request.getNotes())
                .build();

        // Create order items from cart
        List<OrderItem> orderItems = cart.getItems().stream()
                .map(cartItem -> OrderItem.builder()
                        .order(order)
                        .product(cartItem.getProduct())
                        .quantity(cartItem.getQuantity())
                        .price(cartItem.getProduct().getPrice())
                        .subtotal(cartItem.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                        .build())
                .collect(Collectors.toList());

        order.setItems(orderItems);

        // Save order
        Order savedOrder = orderRepository.save(order);
        log.info("Order created successfully: {}", savedOrder.getOrderNumber());

        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return mapToDto(savedOrder);
    }

    /**
     * Get orders for a specific user.
     */
    @Transactional(readOnly = true)
    public Page<OrderDto> getUserOrders(Long userId, Pageable pageable) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToDto);
    }

    /**
     * Get order by ID for a specific user.
     */
    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Order not found");
        }

        return mapToDto(order);
    }

    /**
     * Get order by order number.
     */
    @Transactional(readOnly = true)
    public OrderDto getOrderByNumber(Long userId, String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Order not found");
        }

        return mapToDto(order);
    }

    private Address createAddress(User user, CreateOrderRequest.ShippingAddressDto addressDto) {
        return Address.builder()
                .user(user)
                .street(addressDto.getStreet())
                .city(addressDto.getCity())
                .state(addressDto.getState())
                .postalCode(addressDto.getPostalCode())
                .country(addressDto.getCountry())
                .type(Address.AddressType.SHIPPING)
                .isDefault(false)
                .build();
    }

    private BigDecimal calculateShippingCost(BigDecimal subtotal, String shippingMethod) {
        if (subtotal.compareTo(BigDecimal.valueOf(50000)) >= 0) {
            return BigDecimal.ZERO; // Free shipping for orders >= 50000
        }
        if ("express".equalsIgnoreCase(shippingMethod)) {
            return BigDecimal.valueOf(499);
        }
        return BigDecimal.valueOf(199); // Standard shipping
    }

    private String generateOrderNumber() {
        return "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    private OrderDto mapToDto(Order order) {
        return OrderDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .items(order.getItems().stream()
                        .map(this::mapItemToDto)
                        .collect(Collectors.toList()))
                .subtotal(order.getSubtotal())
                .tax(order.getTax())
                .shippingCost(order.getShippingCost())
                .total(order.getTotal())
                .status(order.getStatus().name())
                .paymentStatus(order.getPaymentStatus().name())
                .paymentMethod(order.getPaymentMethod() != null ? order.getPaymentMethod().name() : null)
                .shippingAddress(mapAddressToDto(order.getShippingAddress()))
                .billingAddress(mapAddressToDto(order.getBillingAddress()))
                .trackingNumber(order.getTrackingNumber())
                .notes(order.getNotes())
                .createdAt(order.getCreatedAt())
                .shippedAt(order.getShippedAt())
                .deliveredAt(order.getDeliveredAt())
                .build();
    }

    private OrderItemDto mapItemToDto(OrderItem item) {
        return OrderItemDto.builder()
                .id(item.getId())
                .product(mapProductToDto(item.getProduct()))
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .subtotal(item.getSubtotal())
                .build();
    }

    private ProductDto mapProductToDto(Product product) {
        // Create a copy of imageUrls to avoid LazyInitializationException
        List<String> imageUrlsCopy = product.getImageUrls() != null 
                ? new java.util.ArrayList<>(product.getImageUrls()) 
                : new java.util.ArrayList<>();
        
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .imageUrls(imageUrlsCopy)
                .price(product.getPrice())
                .build();
    }

    private AddressDto mapAddressToDto(Address address) {
        if (address == null) return null;
        return AddressDto.builder()
                .id(address.getId())
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .postalCode(address.getPostalCode())
                .country(address.getCountry())
                .type(address.getType().name())
                .isDefault(address.getIsDefault())
                .build();
    }
}
