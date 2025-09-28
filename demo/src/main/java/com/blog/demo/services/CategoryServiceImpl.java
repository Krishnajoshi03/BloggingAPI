package com.blog.demo.services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.demo.entities.Category;
import com.blog.demo.exceptions.ResourceNotFoundException;
import com.blog.demo.payloads.CategoryDto;
import com.blog.demo.repository.CategoryRepo;

@Service
public class CategoryServiceImpl implements CategoryService {

	@Autowired
	private CategoryRepo categoryRepo;
	
	@Autowired
	private ModelMapper modelMapper;
	@Override
	public CategoryDto createCategory(CategoryDto categoryDto) {
		Category category = this.modelMapper.map(categoryDto, Category.class);
		CategoryDto savedCat =  this.modelMapper.map(this.categoryRepo.save(category),CategoryDto.class);
		return savedCat;
	}

	@Override
	public CategoryDto updateCategory(CategoryDto categoryDto, Integer categoryId) {
		Category existingCategory = this.categoryRepo.findById(categoryId).orElseThrow(()-> new ResourceNotFoundException("Category", "Category Id", categoryId));	
		existingCategory.setTitle(categoryDto.getTitle());
		existingCategory.setDescription(categoryDto.getDescription());
		Category updatedCat = this.categoryRepo.save(existingCategory);
		CategoryDto saved = this.modelMapper.map(updatedCat, CategoryDto.class);
		return saved;
	}

	@Override
	public void deleteCategory(Integer categoryId) {
		Category category = this.categoryRepo.findById(categoryId)
			.orElseThrow(() -> new ResourceNotFoundException("Category", "Category Id", categoryId));
		this.categoryRepo.delete(category);
	}

	@Override
	public CategoryDto getCategory(Integer categoryId) {
		Category category = this.categoryRepo.findById(categoryId)
			.orElseThrow(() -> new ResourceNotFoundException("Category", "Category Id", categoryId));
		return this.modelMapper.map(category, CategoryDto.class);
	}

	@Override
	public List<CategoryDto> getCategories() {
		List<Category> categories = this.categoryRepo.findAll();
		return categories.stream()
			.map(category -> this.modelMapper.map(category, CategoryDto.class))
			.collect(Collectors.toList());
	}

}