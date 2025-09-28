package com.blog.demo.payloads;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class CategoryDto {

	
	private Integer categoryId;
	@Size(min = 4, message = "Category title must be at least 3 characters")
	@NotEmpty
	private String title;
	@NotEmpty
	private String description;
}
