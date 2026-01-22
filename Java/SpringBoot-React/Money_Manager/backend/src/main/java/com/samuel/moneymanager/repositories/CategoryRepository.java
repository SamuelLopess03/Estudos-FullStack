package com.samuel.moneymanager.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.samuel.moneymanager.entities.CategoryEntity;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

	// SELECT * FROM tbl_categories WHERE profile_id = ?
	List<CategoryEntity> findByProfileId(Long profileId);
	
	// SELECT * FROM tbl_categories WHERE id = ? AND profile_id = ?
	Optional<CategoryEntity> findByIdAndProfileId(Long id, Long profileId);
	
	// SELECT * FROM tbl_categories WHERE type = ? AND profile_id = ?
	List<CategoryEntity> findByTypeAndProfileId(String type, Long profileId);
	
	Boolean existsByNameAndProfileId(String name, Long profileId);
	
}	
