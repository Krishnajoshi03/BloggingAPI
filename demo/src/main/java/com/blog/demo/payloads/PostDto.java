package com.blog.demo.payloads;

import java.util.Date;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class PostDto {
	
	@NotEmpty
	@Size(min = 3, message = "Post title must be at least 3 characters")
    private String title;
    @NotEmpty
    @Size(min = 10, message = "Post content must be at least 10")
    private String content;
    private String imageName;
    private Date createdAt;
    private CategoryDto category;
    private UserDto user;
}