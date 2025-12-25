package com.mahalaxmi.ecommerce.service;

import com.mahalaxmi.ecommerce.dto.AddToCartRequest;
import com.mahalaxmi.ecommerce.dto.CartDto;
import com.mahalaxmi.ecommerce.dto.CartItemDto;
import com.mahalaxmi.ecommerce.entity.Cart;
import com.mahalaxmi.ecommerce.entity.CartItem;
import com.mahalaxmi.ecommerce.entity.Product;
import com.mahalaxmi.ecommerce.entity.User;
import com.mahalaxmi.ecommerce.repository.CartRepository;
import com.mahalaxmi.ecommerce.repository.ProductRepository;
import com.mahalaxmi.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

/**
 * Service for managing shopping cart operations.
 */
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    /**
     * Get the current user's cart.
     *
     * @return cart DTO
     */
    @Transactional(readOnly = true)
    public CartDto getCart() {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> createCartForUser(user));
        return convertToDto(cart);
    }

    /**
     * Add an item to the cart.
     *
     * @param request add to cart request
     * @return updated cart
     */
    @Transactional
    public CartDto addToCart(AddToCartRequest request) {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> createCartForUser(user));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getActive()) {
            throw new RuntimeException("Product is not available");
        }

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock");
        }

        // Check if product already in cart
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(newItem);
        }

        Cart savedCart = cartRepository.save(cart);
        return convertToDto(savedCart);
    }

    /**
     * Update cart item quantity.
     *
     * @param itemId cart item ID
     * @param quantity new quantity
     * @return updated cart
     */
    @Transactional
    public CartDto updateCartItem(Long itemId, Integer quantity) {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            if (item.getProduct().getStockQuantity() < quantity) {
                throw new RuntimeException("Insufficient stock");
            }
            item.setQuantity(quantity);
        }

        Cart savedCart = cartRepository.save(cart);
        return convertToDto(savedCart);
    }

    /**
     * Remove an item from the cart.
     *
     * @param itemId cart item ID
     * @return updated cart
     */
    @Transactional
    public CartDto removeFromCart(Long itemId) {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().removeIf(item -> item.getId().equals(itemId));

        Cart savedCart = cartRepository.save(cart);
        return convertToDto(savedCart);
    }

    /**
     * Clear the entire cart.
     *
     * @return empty cart
     */
    @Transactional
    public CartDto clearCart() {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().clear();
        Cart savedCart = cartRepository.save(cart);
        return convertToDto(savedCart);
    }

    private Cart createCartForUser(User user) {
        Cart cart = Cart.builder()
                .user(user)
                .build();
        return cartRepository.save(cart);
    }

    private CartDto convertToDto(Cart cart) {
        CartDto cartDto = new CartDto();
        cartDto.setId(cart.getId());
        
        var items = cart.getItems().stream()
                .map(item -> {
                    CartItemDto itemDto = modelMapper.map(item, CartItemDto.class);
                    BigDecimal subtotal = item.getProduct().getPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity()));
                    itemDto.setSubtotal(subtotal);
                    return itemDto;
                })
                .collect(Collectors.toList());
        
        cartDto.setItems(items);
        
        BigDecimal total = items.stream()
                .map(CartItemDto::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        cartDto.setTotal(total);
        cartDto.setItemCount(items.size());
        
        return cartDto;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
