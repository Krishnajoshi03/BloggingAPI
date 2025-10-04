package com.blog.demo.services;

import java.util.List;
import com.blog.demo.payloads.PostDto;
import com.blog.demo.payloads.PostResponse;

public interface PostService {
    PostDto createPost(PostDto postDto,Integer userId,Integer categoryId);
    PostDto updatePost(PostDto postDto, Integer postId);
    void deletePost(Integer postId);
    PostDto getPostById(Integer postId);
   PostResponse getAllPosts(Integer pageNumber, Integer pageSize, String sortBy, String sortDir);
    List<PostDto> getPostsByUser(Integer userId);
    List<PostDto> getPostsByCategory(Integer categoryId);
    List<PostDto> searchPosts(String title);
    }
