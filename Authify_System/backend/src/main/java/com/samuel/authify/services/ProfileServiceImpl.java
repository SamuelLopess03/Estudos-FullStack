package com.samuel.authify.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.samuel.authify.entities.UserEntity;
import com.samuel.authify.io.ProfileRequest;
import com.samuel.authify.io.ProfileResponse;
import com.samuel.authify.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {
	
	private final UserRepository userRepository;

	@Override
	public ProfileResponse createProfile(ProfileRequest request) {
		UserEntity newProfile = convertToUserEntity(request);
		
		newProfile = userRepository.save(newProfile);
		
		return convertToProfileResponse(newProfile);
	}

	private UserEntity convertToUserEntity(ProfileRequest request) {
		
		return UserEntity.builder()
				.email(request.getEmail())
				.userId(UUID.randomUUID().toString())
				.name(request.getName())
				.password(request.getPassword())
				.isAccountVerified(false)
				.resetOtpExpireAt(0L)
				.verifyOtp(null)
				.verifyOtpExpireAt(0L)
				.resetOtp(null)
				.build();
		
	}
	
	private ProfileResponse convertToProfileResponse(UserEntity newProfile) {
		
		return ProfileResponse.builder()
				.name(newProfile.getName())
				.email(newProfile.getEmail())
				.userId(newProfile.getUserId())
				.isAccountVerified(newProfile.getIsAccountVerified())
				.build();
		
	}

}
