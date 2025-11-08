package com.blog.demo.controllers;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.blog.demo.config.AppConstants;
import com.blog.demo.payloads.ApiResponse;
import com.blog.demo.payloads.PostDto;
import com.blog.demo.payloads.PostResponse;
import com.blog.demo.services.FileService;
import com.blog.demo.services.PostService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/api/")
public class PostController {

	@Autowired
	private PostService postService;
	@Autowired
	private FileService fileService;
	@Value("${project.images}")
	private String path ;

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
	public ResponseEntity<PostDto> getPostById(
			@Positive(message = "Post Id must be positive") @PathVariable Integer postId) {
		PostDto postDto = this.postService.getPostById(postId);
		return new ResponseEntity<>(postDto, HttpStatus.OK);
	}

	@GetMapping("posts")
	public ResponseEntity<PostResponse> getAllPosts(
			@RequestParam(value = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
			@RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
			@RequestParam(value = "sortBy", defaultValue = AppConstants.SORT_BY, required = false) String sortBy,
			@RequestParam(value = "sortDir", defaultValue = AppConstants.SORT_DIR, required = false) String sortDir) {
		PostResponse response = postService.getAllPosts(pageNumber, pageSize, sortBy, sortDir);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@GetMapping("user/{userId}/posts")
	public ResponseEntity<List<PostDto>> getPostsByUser(
			@PathVariable @Positive(message = "User id must be positive") Integer userId) {
		List<PostDto> posts = postService.getPostsByUser(userId);
		return new ResponseEntity<>(posts, HttpStatus.OK);
	}

	@GetMapping("category/{categoryId}/posts")
	public ResponseEntity<List<PostDto>> getPostsByCategory(
			@PathVariable @Positive(message = "Category id must be positive") Integer categoryId) {
		List<PostDto> posts = postService.getPostsByCategory(categoryId);
		return new ResponseEntity<>(posts, HttpStatus.OK);
	}

	@DeleteMapping("/posts/{postId}")
	public ResponseEntity<ApiResponse> deletPost(@PathVariable Integer postId) {
		postService.deletePost(postId);
		return new ResponseEntity<>(new ApiResponse("Post Deleted ", true), HttpStatus.OK);
	}

	@GetMapping("/posts/search/{keyWord}")
	public ResponseEntity<List<PostDto>> searchPosts(@PathVariable String keyWord) {
		List<PostDto> posts = postService.searchPosts(keyWord);
		return new ResponseEntity<List<PostDto>>(posts, HttpStatus.OK);
	}
	@PostMapping("posts/image/upload/{postId}")
	public ResponseEntity<PostDto> uploadPostImage(@RequestParam("image") MultipartFile muFile,@PathVariable Integer postId) throws IOException{
		
		PostDto postToUpdate = this.postService.getPostById(postId);
		String fileName = this.fileService.uploadImage(path, muFile);
		postToUpdate.setImageName(fileName);
		return new ResponseEntity<PostDto>(this.postService.updatePost(postToUpdate, postId),HttpStatus.OK);
		
	}
	
	@GetMapping(value="posts/image/{imageName}",produces=org.springframework.http.MediaType.IMAGE_JPEG_VALUE)
	public void downloadImage(@PathVariable String imageName,HttpServletResponse response) throws IOException{
		response.setContentType(org.springframework.http.MediaType.IMAGE_JPEG_VALUE);
		InputStream is = this.fileService.getResource(path, imageName);
		StreamUtils.copy(is, response.getOutputStream());
		
	}
}