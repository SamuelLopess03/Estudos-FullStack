package com.samuel.authify.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.samuel.authify.io.ProfileRequest;
import com.samuel.authify.io.ProfileResponse;
import com.samuel.authify.services.ProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1.0")
@RequiredArgsConstructor
public class ProfileController {
	
	private final ProfileService profileService;
	
	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	public ProfileResponse register(@RequestBody ProfileRequest request) {
		ProfileResponse response = profileService.createProfile(request);
		
		// TODO: Send Welcome Email
		
		return response;
	}

}
