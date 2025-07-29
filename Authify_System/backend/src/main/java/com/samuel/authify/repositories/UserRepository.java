package com.samuel.authify.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.samuel.authify.entities.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

	Optional<UserEntity> findByEmail(String email);
	
	Boolean existsByEmail(String email);
	
}
