package com.samuel.authify.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.samuel.authify.io.ProfileRequest;
import com.samuel.authify.io.ProfileResponse;
import com.samuel.authify.services.EmailService;
import com.samuel.authify.services.ProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ProfileController {
	
	private final ProfileService profileService;
	
	private final EmailService emailService;
	
	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	public ProfileResponse register(@Valid @RequestBody ProfileRequest request) {
		ProfileResponse response = profileService.createProfile(request);
		
		emailService.sendWelcomeEmail(response.getEmail(), response.getName());
		
		return response;
	}
	
	@GetMapping("/profile")
	public ProfileResponse getProfile(@CurrentSecurityContext(expression = "authentication?.name") String email) {
		return profileService.getProfile(email);
	}

}
