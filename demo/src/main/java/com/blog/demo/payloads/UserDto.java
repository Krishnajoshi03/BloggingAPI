package com.blog.demo.payloads;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class UserDto {
	
	
	private int id;
	@NotBlank
	@Size(min=4, message="Username must be min of 4 characters")
	private String name;
	@NotBlank
	@Email(message="Email address is not valid")
	private String email;
	@NotBlank
	@Pattern(regexp="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{3,10}$", message="Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character and no whitespace")
	@Size(min=3, max=10, message="Password must be min of 3 characters and max of 10 characters")
	private String password;
	@NotBlank
	private String about;
	

}