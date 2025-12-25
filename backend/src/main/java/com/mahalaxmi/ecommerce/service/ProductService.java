package com.mahalaxmi.ecommerce.service;

import com.mahalaxmi.ecommerce.dto.ProductDto;
import com.mahalaxmi.ecommerce.entity.Product;
import com.mahalaxmi.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for managing products.
 */
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    /**
     * Get all active products with pagination.
     *
     * @param pageable pagination information
     * @return page of products
     */
    @Transactional(readOnly = true)
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return productRepository.findByActiveTrue(pageable)
                .map(this::convertToDto);
    }

    /**
     * Get product by ID.
     *
     * @param id product ID
     * @return product DTO
     */
    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToDto(product);
    }

    /**
     * Search products by keyword.
     *
     * @param keyword search keyword
     * @param pageable pagination information
     * @return page of matching products
     */
    @Transactional(readOnly = true)
    public Page<ProductDto> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchProducts(keyword, pageable)
                .map(this::convertToDto);
    }

    /**
     * Get products by category.
     *
     * @param categoryId category ID
     * @param pageable pagination information
     * @return page of products
     */
    @Transactional(readOnly = true)
    public Page<ProductDto> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable)
                .map(this::convertToDto);
    }

    /**
     * Get products by type.
     *
     * @param type product type
     * @param pageable pagination information
     * @return page of products
     */
    @Transactional(readOnly = true)
    public Page<ProductDto> getProductsByType(Product.ProductType type, Pageable pageable) {
        return productRepository.findByTypeAndActiveTrue(type, pageable)
                .map(this::convertToDto);
    }

    /**
     * Get featured products.
     *
     * @param pageable pagination information
     * @return page of featured products
     */
    @Transactional(readOnly = true)
    public Page<ProductDto> getFeaturedProducts(Pageable pageable) {
        return productRepository.findByFeaturedTrueAndActiveTrue(pageable)
                .map(this::convertToDto);
    }

    /**
     * Get all brands.
     *
     * @return list of brand names
     */
    @Transactional(readOnly = true)
    public List<String> getAllBrands() {
        return productRepository.findAllBrands();
    }

    /**
     * Create a new product (admin only).
     *
     * @param productDto product data
     * @return created product
     */
    @Transactional
    public ProductDto createProduct(ProductDto productDto) {
        Product product = convertToEntity(productDto);
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    /**
     * Update an existing product (admin only).
     *
     * @param id product ID
     * @param productDto updated product data
     * @return updated product
     */
    @Transactional
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        modelMapper.map(productDto, existingProduct);
        existingProduct.setId(id);

        Product updatedProduct = productRepository.save(existingProduct);
        return convertToDto(updatedProduct);
    }

    /**
     * Delete a product (admin only).
     *
     * @param id product ID
     */
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        product.setActive(false);
        productRepository.save(product);
    }

    private ProductDto convertToDto(Product product) {
        return modelMapper.map(product, ProductDto.class);
    }

    private Product convertToEntity(ProductDto productDto) {
        return modelMapper.map(productDto, Product.class);
    }
}
