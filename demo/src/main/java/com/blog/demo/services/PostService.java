package com.blog.demo.services;

import java.util.List;
import com.blog.demo.payloads.PostDto;

public interface PostService {
    PostDto createPost(PostDto postDto,Integer userId,Integer categoryId);
    PostDto updatePost(PostDto postDto, Integer postId);
    void deletePost(Integer postId);
    PostDto getPostById(Integer postId);
    List<PostDto> getAllPosts();
    List<PostDto> getPostsByUser(Integer userId);
    List<PostDto> getPostsByCategory(Integer categoryId);
}
