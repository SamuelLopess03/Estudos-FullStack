package com.samuel.moneymanager.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.samuel.moneymanager.dtos.ProfileDTO;
import com.samuel.moneymanager.services.ProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ProfileController {
	
	private final ProfileService profileService;
	 
	@PostMapping("/register")
	public ResponseEntity<ProfileDTO> registerProfile(@RequestBody ProfileDTO profileDTO) {
		ProfileDTO registeredProfile = profileService.registerProfile(profileDTO);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(registeredProfile);
	}
	
	@GetMapping("/activate")
	public ResponseEntity<String> activateProfile(@RequestParam String token) {
		boolean isActivated = profileService.activateProfile(token);
		
		if(isActivated) {
			return ResponseEntity.ok("Profile Activated Successfully");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Activation Token not Found or Already Used");
		}
	}
}
