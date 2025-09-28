package com.blog.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.demo.payloads.PostDto;
import com.blog.demo.services.PostService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/api/")
public class PostController {

	@Autowired
	private PostService postService;
	
	@PostMapping("user/{userId}/category/{categoryId}/posts")
	public ResponseEntity<PostDto> createPost(@RequestBody @Valid PostDto postDto,
			@Positive(message = "User Id must be positive") @PathVariable Integer userId,
			@Positive(message = "Category Id must be positive") @PathVariable Integer categoryId) {
		PostDto createdPost = this.postService.createPost(postDto, userId, categoryId);
		return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
	}
	@PutMapping("/posts/{postId}")
	public ResponseEntity<PostDto> updatePost(@RequestBody @Valid PostDto postDto,
			@Positive(message = "Post Id must be positive") @PathVariable Integer postId) {
		PostDto updatedPost = this.postService.updatePost(postDto, postId);
		return new ResponseEntity<>(updatedPost, HttpStatus.OK);
	}
	
	@GetMapping("posts/{postId}")
	public ResponseEntity<PostDto> getPostById(@Positive(message = "Post Id must be positive") @PathVariable Integer postId) {
		PostDto postDto = this.postService.getPostById(postId);
		return new ResponseEntity<>(postDto, HttpStatus.OK);
	}
	@GetMapping("posts/")
	public ResponseEntity<List<PostDto>> getAllPosts(){
		List<PostDto> posts = postService.getAllPosts();
		return new ResponseEntity<>(posts,HttpStatus.OK);
	}
	
	@GetMapping("user/{userId}/posts")
	public ResponseEntity<List<PostDto>> getPostsByUser(@PathVariable @Positive(message = "User id must be positive")Integer userId){
		List<PostDto> posts = postService.getPostsByUser(userId);
		return new ResponseEntity<>(posts,HttpStatus.OK);
	}
	@GetMapping("category/{categoryId}/posts")
	public ResponseEntity<List<PostDto>> getPostsByCategory(@PathVariable @Positive(message = "Category id must be positive")Integer categoryId){
		List<PostDto> posts = postService.getPostsByCategory(categoryId);
		return new ResponseEntity<>(posts,HttpStatus.OK);
	}
}