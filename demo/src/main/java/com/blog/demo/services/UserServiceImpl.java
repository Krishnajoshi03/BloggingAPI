package com.blog.demo.services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.demo.entities.User;
import com.blog.demo.exceptions.ResourceNotFoundException;
import com.blog.demo.payloads.UserDto;
import com.blog.demo.repository.UserRepo;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepo userRepo;
	
	@Autowired
	 ModelMapper modelMapper;
	
	@Override
	public UserDto createUser(UserDto userDto) {
		User user = userDtoToUser(userDto);
		User savedUser = this.userRepo.save(user);
		return userToUserDto(savedUser);
	}

	@Override
	public UserDto updateUser(UserDto user, Integer userId) {
		User existingUser = this.userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
		existingUser.setName(user.getName());
		existingUser.setEmail(user.getEmail());
		existingUser.setPassword(user.getPassword());
		existingUser.setAbout(user.getAbout());
		User updatedUser =  this.userRepo.save(existingUser);
		return userToUserDto(updatedUser);
	}

	@Override
	public UserDto getUserById(Integer userId) {
		
		User user =  userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
		return userToUserDto(user);
	}

	@Override
	public List<UserDto> getAllUsers() {
		List<User> users = this.userRepo.findAll();
		return users.stream().map(user -> this.userToUserDto(user)).collect(Collectors.toList());
	}

	@Override
	public void deleteUser(Integer userId) {
		User user =  userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
		this.userRepo.delete(user);
	}
	User userDtoToUser(UserDto userDto) {
		User user = this.modelMapper.map(userDto, User.class);
		return user;
	}
	UserDto userToUserDto(User user) {
		UserDto userDto = this.modelMapper.map(user, UserDto.class);
		return userDto;
	}

}
