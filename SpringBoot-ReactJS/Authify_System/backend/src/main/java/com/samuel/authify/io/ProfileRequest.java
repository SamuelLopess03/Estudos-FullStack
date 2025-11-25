package com.samuel.authify.io;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileRequest {
	
	@NotBlank(message = "Name Should be not Empty.")
	private String name;
	
	@Email(message = "Enter Valid Email Address.")
	@NotNull(message = "Email Should be not Empty.")
	private String email;
	
	@Size(min = 6, message = "Password Must be Atleast 6 Characters")
	private String password;
	
}
