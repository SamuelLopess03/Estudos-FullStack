package com.samuel.moneymanager.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.samuel.moneymanager.dtos.AuthDTO;
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
	
	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@RequestBody AuthDTO authDTO) {
		try {
			if(!profileService.isAccountActive(authDTO.getEmail())) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", 
						"Account is not Active. Please Activate Your Account First."));
			}
			
			Map<String, Object> response = profileService.authenticateAndGenerateToken(authDTO);
			
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
		}
	}
	
	@GetMapping("/profile")
	public ResponseEntity<ProfileDTO> getPublicProfile() {
		ProfileDTO profileDTO = profileService.getPublicProfile(null);
		
		return ResponseEntity.ok(profileDTO);
	}
}
