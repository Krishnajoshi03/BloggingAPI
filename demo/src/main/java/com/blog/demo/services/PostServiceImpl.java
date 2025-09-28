package com.blog.demo.services;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.demo.entities.Category;
import com.blog.demo.entities.Post;
import com.blog.demo.entities.User;
import com.blog.demo.exceptions.ResourceNotFoundException;
import com.blog.demo.payloads.PostDto;
import com.blog.demo.repository.CategoryRepo;
import com.blog.demo.repository.PostRepo;
import com.blog.demo.repository.UserRepo;

@Service
public class PostServiceImpl implements PostService {

	@Autowired
	private PostRepo postRepo;

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private CategoryRepo categoryRepo;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public PostDto createPost(PostDto postDto, Integer userId, Integer categoryId) {
		User user = userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "User Id", userId));
		Category category = categoryRepo.findById(categoryId)
				.orElseThrow(() -> new ResourceNotFoundException("Category", "Category Id", categoryId));
		Post post = modelMapper.map(postDto, Post.class);
		post.setImageName("default.png");
		post.setCreatedAt(new Date());
		post.setUser(user);
		post.setCategory(category);
		Post savedPost = postRepo.save(post);
		return modelMapper.map(savedPost, PostDto.class);
	}

	@Override
	public PostDto updatePost(PostDto postDto, Integer postId) {
		Post post = postRepo.findById(postId)
				.orElseThrow(() -> new ResourceNotFoundException("Post", "Post Id", postId));
		Post updatedPost = postRepo.save(post);
		return modelMapper.map(updatedPost, PostDto.class);
	}

	@Override
	public void deletePost(Integer postId) {
		Post post = postRepo.findById(postId)
				.orElseThrow(() -> new ResourceNotFoundException("Post", "Post Id", postId));
		postRepo.delete(post);
	}

	@Override
	public PostDto getPostById(Integer postId) {
		Post post = postRepo.findById(postId)
				.orElseThrow(() -> new ResourceNotFoundException("Post", "Post Id", postId));
		return modelMapper.map(post, PostDto.class);
	}

	@Override
	public List<PostDto> getAllPosts() {
		List<Post> posts = postRepo.findAll();
		return posts.stream().map(post -> modelMapper.map(post, PostDto.class)).collect(Collectors.toList());
	}

	@Override
	public List<PostDto> getPostsByUser(Integer userId) {
		User user = userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "User Id", userId));
		List<Post> posts = postRepo.findByUser(user);
		return posts.stream().map(post -> modelMapper.map(post,PostDto.class)).collect(Collectors.toList());	
	}

	@Override
	public List<PostDto> getPostsByCategory(Integer categoryId) {
		Category category = categoryRepo.findById(categoryId)
				.orElseThrow(() -> new ResourceNotFoundException("Category", "Category Id", categoryId));
		List<Post> posts = postRepo.findByCategory(category);
		return posts.stream().map(post->modelMapper.map(post,PostDto.class)).collect(Collectors.toList());
	}
}