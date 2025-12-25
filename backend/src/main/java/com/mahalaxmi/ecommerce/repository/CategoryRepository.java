package com.mahalaxmi.ecommerce.repository;

import com.mahalaxmi.ecommerce.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Category entity operations.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    /**
     * Find a category by name.
     *
     * @param name the category name
     * @return Optional containing the category if found
     */
    Optional<Category> findByName(String name);
    
    /**
     * Find all active categories.
     *
     * @return list of active categories
     */
    List<Category> findByActiveTrue();
    
    /**
     * Find all active root categories (categories without a parent).
     *
     * @return list of root categories
     */
    List<Category> findByParentIsNullAndActiveTrue();
    
    /**
     * Find all active subcategories of a parent category.
     *
     * @param parentId the parent category ID
     * @return list of subcategories
     */
    List<Category> findByParentIdAndActiveTrue(Long parentId);
}
