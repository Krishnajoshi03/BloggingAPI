package com.blog.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blog.demo.entities.Category;
import com.blog.demo.entities.Post;
import com.blog.demo.entities.User;

public interface PostRepo  extends JpaRepository<Post, Integer>{
	
	List<Post> findByUser(User user);
	List<Post> findByCategory(Category category);
}