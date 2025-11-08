package com.blog.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.demo.payloads.ApiResponse;
import com.blog.demo.payloads.CategoryDto;
import com.blog.demo.services.CategoryService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

	@Autowired
	private CategoryService categoryService;
	
	
	@PostMapping("/")
	public ResponseEntity<CategoryDto> createCategory(@RequestBody  @Valid CategoryDto categoryDto){
		CategoryDto createdCat = this.categoryService.createCategory(categoryDto);
		return new ResponseEntity<>(createdCat, HttpStatus.CREATED);
	}
	@PutMapping("/{categoryId}")
	public ResponseEntity<CategoryDto> updateCategory(@RequestBody @Valid CategoryDto categoryDto, @Positive(message = "Category Id must be positive")@PathVariable Integer categoryId){
		CategoryDto updatedCat = this.categoryService.updateCategory(categoryDto, categoryId);
		return new ResponseEntity<>(updatedCat, HttpStatus.OK);
	}
	@DeleteMapping("/{categoryId}")
	public ResponseEntity<ApiResponse> deleteCategory( @Positive(message = "Category Id must be positive")@PathVariable Integer categoryId){
		this.categoryService.deleteCategory(categoryId);
		return new ResponseEntity<>(new ApiResponse("Category deleted successfully", true), HttpStatus.OK);
	}
	
	@GetMapping("/{categoryId}")
	public ResponseEntity<CategoryDto> getCategory(@Positive(message = "Category Id must be positive")@PathVariable Integer categoryId){
		CategoryDto categoryDto = this.categoryService.getCategory(categoryId);
		return new ResponseEntity<>(categoryDto, HttpStatus.OK);
	}
	@GetMapping("/")
	public ResponseEntity<java.util.List<CategoryDto>> getCategories(){
		java.util.List<CategoryDto> categories = this.categoryService.getCategories();
		return new ResponseEntity<>(categories, HttpStatus.OK);
	}
}
