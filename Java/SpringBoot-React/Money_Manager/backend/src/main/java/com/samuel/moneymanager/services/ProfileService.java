package com.samuel.moneymanager.services;

import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.samuel.moneymanager.dtos.AuthDTO;
import com.samuel.moneymanager.dtos.ProfileDTO;
import com.samuel.moneymanager.entities.ProfileEntity;
import com.samuel.moneymanager.repositories.ProfileRepository;
import com.samuel.moneymanager.utils.JWTUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

	private final ProfileRepository profileRepository;
	
	private final EmailService emailService;
	
	private final PasswordEncoder passwordEncoder;
	
	private final AuthenticationManager authenticationManager;
	
	private final JWTUtil jwtUtil;
	
	@Value("${app.activation.url}")
	private String activationURL;
	
	public ProfileDTO registerProfile(ProfileDTO profileDTO) {
		ProfileEntity newProfile = toEntity(profileDTO);
		
		newProfile.setActivationToken(UUID.randomUUID().toString());
		newProfile = profileRepository.save(newProfile);
		
		// Send Activation Email
		String activationLink = activationURL + "/api/v1.0/activate?token=" + newProfile.getActivationToken();
		String subject = "Activate Your Money Manager Account";
		String body = "Click on the Following Link to Activate Your Account: " + activationLink;
		emailService.sendEmail(newProfile.getEmail(), subject, body);
		
		return toDTO(newProfile);
	}
	
	public boolean activateProfile(String activationToken) {
		return profileRepository.findByActivationToken(activationToken)
				.map(profile -> {
					profile.setIsActive(true);
					profileRepository.save(profile);
					return true;
				}).orElse(false);
	}
	
	public boolean isAccountActive(String email) {
		return profileRepository.findByEmail(email)
				.map(ProfileEntity::getIsActive)
				.orElse(false);
	}
	
	public ProfileEntity getCurrentProfile() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		return profileRepository.findByEmail(authentication.getName())
				.orElseThrow(() -> new UsernameNotFoundException("Profile not Found with Email: " + authentication.getName()));
	}
	
	public ProfileDTO getPublicProfile(String email) {
		ProfileEntity currentUser = null;
		
		if(email == null) {
			currentUser = getCurrentProfile();
		} else {
			currentUser = profileRepository.findByEmail(email)
					.orElseThrow(() -> new UsernameNotFoundException("Profile not Found with Email: " + email));
		}
		
		return ProfileDTO.builder()
				.id(currentUser.getId())
				.fullName(currentUser.getFullName())
				.email(currentUser.getEmail())
				.profileImageUrl(currentUser.getProfileImageUrl())
				.createdAt(currentUser.getCreatedAt())
				.updatedAt(currentUser.getUpdatedAt())
				.build();
	}
	
	public Map<String, Object> authenticateAndGenerateToken(AuthDTO authDTO) {
		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authDTO.getEmail(), authDTO.getPassword()));
			
			String token = jwtUtil.generateToken(authDTO.getEmail());
			
			return Map.of(
					"token", token,
					"user", getPublicProfile(authDTO.getEmail())
					);
		} catch (Exception e) {
			throw new RuntimeException("Invalid Email or Password");
		}
	}
	
	public ProfileEntity toEntity(ProfileDTO profileDTO) {
		return ProfileEntity.builder()
				.id(profileDTO.getId())
				.fullName(profileDTO.getFullName())
				.email(profileDTO.getEmail())
				.password(passwordEncoder.encode(profileDTO.getPassword()))
				.profileImageUrl(profileDTO.getProfileImageUrl())
				.createdAt(profileDTO.getCreatedAt())
				.updatedAt(profileDTO.getUpdatedAt())
				.build();
	}
	
	public ProfileDTO toDTO(ProfileEntity profileEntity) {
		return ProfileDTO.builder()
				.id(profileEntity.getId())
				.fullName(profileEntity.getFullName())
				.email(profileEntity.getEmail())
				.profileImageUrl(profileEntity.getProfileImageUrl())
				.createdAt(profileEntity.getCreatedAt())
				.updatedAt(profileEntity.getUpdatedAt())
				.build();
	}
	
}
