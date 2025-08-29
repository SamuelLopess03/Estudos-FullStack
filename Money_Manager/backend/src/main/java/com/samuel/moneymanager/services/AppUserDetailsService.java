package com.samuel.moneymanager.services;

import java.util.Collections;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.samuel.moneymanager.entities.ProfileEntity;
import com.samuel.moneymanager.repositories.ProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {
	
	private final ProfileRepository profileRepository;
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		ProfileEntity existingProfile = profileRepository.findByEmail(email)
										.orElseThrow(() -> 
											new UsernameNotFoundException("Profile not Found with Email: " + email)
										);
		
		return User.builder()
				   .username(existingProfile.getEmail())
				   .password(existingProfile.getPassword())
				   .authorities(Collections.emptyList())
				   .build();
	}
	
}
