package com.blog.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blog.demo.entities.Comment;

public interface CommentRepo extends JpaRepository<Comment,Integer>{
	
	
}
