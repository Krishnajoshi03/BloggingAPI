package com.blog.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blog.demo.entities.User;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {

}
