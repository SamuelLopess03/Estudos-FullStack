package com.samuel.authify.io;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

	private String email;
	
	private String token;
	
}
