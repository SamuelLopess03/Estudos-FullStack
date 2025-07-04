package com.samuel.authify.services;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.samuel.authify.entities.UserEntity;
import com.samuel.authify.io.ProfileRequest;
import com.samuel.authify.io.ProfileResponse;
import com.samuel.authify.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {
	
	private final UserRepository userRepository;
	
	private final PasswordEncoder passwordEncoder;
	
	private final EmailService emailService;

	@Override
	public ProfileResponse createProfile(ProfileRequest request) {
		UserEntity newProfile = convertToUserEntity(request);
		
		if(!userRepository.existsByEmail(request.getEmail())) {
			newProfile = userRepository.save(newProfile);
			
			return convertToProfileResponse(newProfile);
		}
		
		throw new ResponseStatusException(HttpStatus.CONFLICT, "Email Already Exists.");
	}
	
	@Override
	public ProfileResponse getProfile(String email) {
		UserEntity existingUser = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not Found: " + email));
		
		
		return convertToProfileResponse(existingUser);
	}
	
	@Override
	public void sendResetOtp(String email) {
		UserEntity existingUser = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not Found: " + email));
		
		String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
		
		long expiryTime = System.currentTimeMillis() + (15 * 60 * 1000);
		
		existingUser.setResetOtp(otp);
		existingUser.setResetOtpExpireAt(expiryTime);
		
		userRepository.save(existingUser);
		
		try {
			emailService.sendResetOtpEmail(existingUser.getEmail(), otp);
		} catch (Exception e) {
			throw new RuntimeException("Unable to Send Email");
		}
		
	}
	
	@Override
	public void resetPassword(String email, String otp, String newPassword) {
		UserEntity existingUser = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not Found: " + email));
		
		if(existingUser.getResetOtp() == null || !existingUser.getResetOtp().equals(otp)) {
			throw new RuntimeException("Invalid OTP");
		}
		
		if(existingUser.getResetOtpExpireAt() < System.currentTimeMillis()) {
			throw new RuntimeException("OTP Expired");
		}
		
		existingUser.setPassword(passwordEncoder.encode(newPassword));
		existingUser.setResetOtp(null);
		existingUser.setResetOtpExpireAt(0L);
		
		userRepository.save(existingUser);
	}
	
	@Override
	public void sendOtp(String email) {
		UserEntity existingUser = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not Found: " + email));
		
		if(existingUser.getIsAccountVerified() != null && 
				existingUser.getIsAccountVerified()) {
			return;
		}
		
		String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
		
		long expiryTime = System.currentTimeMillis() + (24 * 60 * 60 * 1000);
		
		existingUser.setVerifyOtp(otp);
		existingUser.setVerifyOtpExpireAt(expiryTime);
		
		userRepository.save(existingUser);
		
		try {
			emailService.sendOtpEmail(existingUser.getEmail(), otp);
		} catch (Exception e) {
			throw new RuntimeException("Unable to Send Email");
		}
		
	}

	@Override
	public void verifyOtp(String email, String otp) {
		UserEntity existingUser = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not Found: " + email));
		
		if(existingUser.getVerifyOtp() == null ||
				!existingUser.getVerifyOtp().equals(otp)) {
			throw new RuntimeException("Invalid OTP");
		}
		
		if(existingUser.getVerifyOtpExpireAt() < System.currentTimeMillis()) {
			throw new RuntimeException("OTP Expired");
		}
		
		existingUser.setIsAccountVerified(true);
		existingUser.setVerifyOtp(null);
		existingUser.setVerifyOtpExpireAt(0L);
		
		userRepository.save(existingUser);
	}

	private UserEntity convertToUserEntity(ProfileRequest request) {
		
		return UserEntity.builder()
				.email(request.getEmail())
				.userId(UUID.randomUUID().toString())
				.name(request.getName())
				.password(passwordEncoder.encode(request.getPassword()))
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
