package com.blog.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.demo.payloads.ApiResponse;
import com.blog.demo.payloads.CommentDto;
import com.blog.demo.services.CommentService;

import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
	
	@Autowired
	CommentService commentService;
	
	@PostMapping("/post/{postId}/user/{userId}")
	ResponseEntity<CommentDto> createComment(@RequestBody CommentDto commentDto, @PathVariable @Positive(message = "post id must be greater than 0") Integer postId, @PathVariable Integer userId){
		
		CommentDto createdComment = this.commentService.createComment(commentDto, postId, userId);
		return new ResponseEntity<>(createdComment,HttpStatus.CREATED);
	}
	@DeleteMapping("/{commentId}")
	ResponseEntity<ApiResponse> deleteComment(@PathVariable @Positive(message = "comment id must be greater than 0") Integer commentId){
		this.commentService.deleteComment(commentId);
		return new ResponseEntity<>(new ApiResponse("Comment with id "+commentId+" deleted successfully!",true),HttpStatus.OK);
	}
}
