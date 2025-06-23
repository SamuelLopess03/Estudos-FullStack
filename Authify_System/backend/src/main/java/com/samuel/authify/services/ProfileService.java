package com.samuel.authify.services;

import com.samuel.authify.io.ProfileRequest;
import com.samuel.authify.io.ProfileResponse;

public interface ProfileService {
	
	ProfileResponse createProfile(ProfileRequest request);
	
	ProfileResponse getProfile(String email);
	
}
