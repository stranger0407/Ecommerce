package com.mahalaxmi.ecommerce.controller;

import com.mahalaxmi.ecommerce.dto.AddToCartRequest;
import com.mahalaxmi.ecommerce.dto.CartDto;
import com.mahalaxmi.ecommerce.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for cart endpoints.
 */
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /**
     * Get current user's cart.
     *
     * @return cart details
     */
    @GetMapping
    public ResponseEntity<CartDto> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    /**
     * Add item to cart.
     *
     * @param request add to cart request
     * @return updated cart
     */
    @PostMapping("/items")
    public ResponseEntity<CartDto> addToCart(@Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(request));
    }

    /**
     * Update cart item quantity.
     *
     * @param itemId cart item ID
     * @param quantity new quantity
     * @return updated cart
     */
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDto> updateCartItem(
            @PathVariable Long itemId,
            @RequestParam Integer quantity
    ) {
        return ResponseEntity.ok(cartService.updateCartItem(itemId, quantity));
    }

    /**
     * Remove item from cart.
     *
     * @param itemId cart item ID
     * @return updated cart
     */
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDto> removeFromCart(@PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeFromCart(itemId));
    }

    /**
     * Clear entire cart.
     *
     * @return empty cart
     */
    @DeleteMapping
    public ResponseEntity<CartDto> clearCart() {
        return ResponseEntity.ok(cartService.clearCart());
    }
}
