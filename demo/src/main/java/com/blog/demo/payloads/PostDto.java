package com.blog.demo.payloads;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.blog.demo.entities.Comment;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class PostDto {
	
	
	private Integer postId;
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
    private Set<CommentDto> comments = new HashSet<>();
}