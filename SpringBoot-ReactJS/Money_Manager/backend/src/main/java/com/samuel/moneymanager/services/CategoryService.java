package com.samuel.moneymanager.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.samuel.moneymanager.dtos.CategoryDTO;
import com.samuel.moneymanager.entities.CategoryEntity;
import com.samuel.moneymanager.entities.ProfileEntity;
import com.samuel.moneymanager.repositories.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

	private final ProfileService profileService;
	
	private final CategoryRepository categoryRepository;
	
	public CategoryDTO saveCategory(CategoryDTO categoryDTO) {
		ProfileEntity profile = profileService.getCurrentProfile();
		
		if(categoryRepository.existsByNameAndProfileId(categoryDTO.getName(), profile.getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Category With This Name Already Exists");
		}
		
		CategoryEntity newCategory = toEntity(categoryDTO, profile);
		newCategory = categoryRepository.save(newCategory);
		
		return toDTO(newCategory);
	}
	
	public CategoryDTO updateCategory(Long categoryId, CategoryDTO dto) {
		ProfileEntity profile = profileService.getCurrentProfile();
		
		CategoryEntity existingCategory = categoryRepository.findByIdAndProfileId(categoryId, profile.getId())
				.orElseThrow(() -> new RuntimeException("Category not Found or not Accessible"));
		
		existingCategory.setName(dto.getName());
		existingCategory.setIcon(dto.getIcon());
		
		existingCategory = categoryRepository.save(existingCategory);
		
		return toDTO(existingCategory);
	}
	
	public List<CategoryDTO> getCategoriesForCurrentUser() {
		ProfileEntity profile = profileService.getCurrentProfile();
		
		List<CategoryEntity> categories = categoryRepository.findByProfileId(profile.getId());
		
		return categories.stream().map(this::toDTO).toList();
	}
	
	public List<CategoryDTO> getCategoriesByTypeForCurrentUser(String type) {
		ProfileEntity profile = profileService.getCurrentProfile();
		
		List<CategoryEntity> entities = categoryRepository.findByTypeAndProfileId(type, profile.getId());
		
		return entities.stream().map(this::toDTO).toList();
	}
	
	private CategoryEntity toEntity(CategoryDTO categoryDTO, ProfileEntity profile) {
		return CategoryEntity.builder()
							 .name(categoryDTO.getName())
							 .type(categoryDTO.getType())
							 .icon(categoryDTO.getIcon())
							 .profile(profile)
							 .build();
	}
	
	private CategoryDTO toDTO(CategoryEntity entity) {
		return CategoryDTO.builder()
						  .id(entity.getId())
						  .profileId(entity.getProfile() != null ? entity.getProfile().getId() : null)
						  .name(entity.getName())
						  .icon(entity.getIcon())
						  .createdAt(entity.getCreatedAt())
						  .updatedAt(entity.getUpdatedAt())
						  .type(entity.getType())
						  .build();
	}
}
