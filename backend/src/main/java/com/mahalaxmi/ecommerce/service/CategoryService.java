package com.mahalaxmi.ecommerce.service;

import com.mahalaxmi.ecommerce.dto.CategoryDto;
import com.mahalaxmi.ecommerce.entity.Category;
import com.mahalaxmi.ecommerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing product categories.
 */
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    /**
     * Get all active categories.
     *
     * @return list of categories
     */
    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findByActiveTrue().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get all root categories.
     *
     * @return list of root categories
     */
    @Transactional(readOnly = true)
    public List<CategoryDto> getRootCategories() {
        return categoryRepository.findByParentIsNullAndActiveTrue().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get category by ID.
     *
     * @param id category ID
     * @return category DTO
     */
    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return convertToDto(category);
    }

    /**
     * Get subcategories of a parent category.
     *
     * @param parentId parent category ID
     * @return list of subcategories
     */
    @Transactional(readOnly = true)
    public List<CategoryDto> getSubcategories(Long parentId) {
        return categoryRepository.findByParentIdAndActiveTrue(parentId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Create a new category (admin only).
     *
     * @param categoryDto category data
     * @return created category
     */
    @Transactional
    public CategoryDto createCategory(CategoryDto categoryDto) {
        Category category = convertToEntity(categoryDto);
        Category savedCategory = categoryRepository.save(category);
        return convertToDto(savedCategory);
    }

    /**
     * Update an existing category (admin only).
     *
     * @param id category ID
     * @param categoryDto updated category data
     * @return updated category
     */
    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        modelMapper.map(categoryDto, existingCategory);
        existingCategory.setId(id);

        Category updatedCategory = categoryRepository.save(existingCategory);
        return convertToDto(updatedCategory);
    }

    /**
     * Delete a category (admin only).
     *
     * @param id category ID
     */
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        category.setActive(false);
        categoryRepository.save(category);
    }

    private CategoryDto convertToDto(Category category) {
        CategoryDto dto = modelMapper.map(category, CategoryDto.class);
        if (category.getParent() != null) {
            dto.setParentId(category.getParent().getId());
        }
        return dto;
    }

    private Category convertToEntity(CategoryDto categoryDto) {
        return modelMapper.map(categoryDto, Category.class);
    }
}
