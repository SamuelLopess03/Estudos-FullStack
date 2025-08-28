package com.samuel.moneymanager.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.samuel.moneymanager.dtos.ProfileDTO;
import com.samuel.moneymanager.entities.ProfileEntity;
import com.samuel.moneymanager.repositories.ProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

	private final ProfileRepository profileRepository;
	
	private final EmailService emailService;
	
	public ProfileDTO registerProfile(ProfileDTO profileDTO) {
		ProfileEntity newProfile = toEntity(profileDTO);
		
		newProfile.setActivationToken(UUID.randomUUID().toString());
		newProfile = profileRepository.save(newProfile);
		
		// Send Activation Email
		String activationLink = "http://localhost:8080/api/v1.0/activate?token=" + newProfile.getActivationToken();
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
	
	public ProfileEntity toEntity(ProfileDTO profileDTO) {
		return ProfileEntity.builder()
				.id(profileDTO.getId())
				.fullName(profileDTO.getFullName())
				.email(profileDTO.getEmail())
				.password(profileDTO.getPassword())
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
