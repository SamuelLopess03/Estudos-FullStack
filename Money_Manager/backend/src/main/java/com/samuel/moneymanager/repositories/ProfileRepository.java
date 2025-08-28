package com.samuel.moneymanager.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.samuel.moneymanager.entities.ProfileEntity;

public interface ProfileRepository extends JpaRepository<ProfileEntity, Long> {

	// SELECT * FROM tbl_profiles WHERE email = ?
	Optional<ProfileEntity> findByEmail(String email);
	
	// SELECT * FROM tbl_profiles WHERE activation_token = ?
	Optional<ProfileEntity> findByActivationToken(String activationToken);
	
}
