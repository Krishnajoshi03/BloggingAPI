package com.blog.demo.services;

import com.blog.demo.payloads.CategoryDto;

public interface CategoryService {

	public CategoryDto createCategory(CategoryDto categoryDto);
	public CategoryDto updateCategory(CategoryDto categoryDto, Integer categoryId);
	public void deleteCategory(Integer categoryId);
	public CategoryDto getCategory(Integer categoryId);
	public java.util.List<CategoryDto> getCategories();
}
