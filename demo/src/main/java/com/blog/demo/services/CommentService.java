package com.blog.demo.services;

import com.blog.demo.payloads.CommentDto;

public interface CommentService {

	public CommentDto createComment(CommentDto commentDto, Integer postId, Integer userId);
	public void deleteComment(Integer commentId);
}
