package com.mahalaxmi.ecommerce.repository;

import com.mahalaxmi.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Product entity operations.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    /**
     * Find all active products.
     *
     * @param pageable pagination information
     * @return page of active products
     */
    Page<Product> findByActiveTrue(Pageable pageable);
    
    /**
     * Find products by category.
     *
     * @param categoryId the category ID
     * @param pageable pagination information
     * @return page of products in the category
     */
    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);
    
    /**
     * Find products by type.
     *
     * @param type the product type
     * @param pageable pagination information
     * @return page of products of the specified type
     */
    Page<Product> findByTypeAndActiveTrue(Product.ProductType type, Pageable pageable);
    
    /**
     * Find featured products.
     *
     * @param pageable pagination information
     * @return page of featured products
     */
    Page<Product> findByFeaturedTrueAndActiveTrue(Pageable pageable);
    
    /**
     * Search products by name or description.
     *
     * @param keyword the search keyword
     * @param pageable pagination information
     * @return page of matching products
     */
    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchProducts(@Param("keyword") String keyword, Pageable pageable);
    
    /**
     * Find products by brand.
     *
     * @param brand the brand name
     * @param pageable pagination information
     * @return page of products by brand
     */
    Page<Product> findByBrandAndActiveTrue(String brand, Pageable pageable);
    
    /**
     * Find all distinct brands.
     *
     * @return list of brand names
     */
    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.active = true AND p.brand IS NOT NULL ORDER BY p.brand")
    List<String> findAllBrands();
}
