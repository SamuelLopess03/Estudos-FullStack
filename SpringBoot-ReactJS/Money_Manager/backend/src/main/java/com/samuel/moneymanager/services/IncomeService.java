package com.samuel.moneymanager.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.samuel.moneymanager.dtos.IncomeDTO;
import com.samuel.moneymanager.entities.CategoryEntity;
import com.samuel.moneymanager.entities.IncomeEntity;
import com.samuel.moneymanager.entities.ProfileEntity;
import com.samuel.moneymanager.repositories.CategoryRepository;
import com.samuel.moneymanager.repositories.IncomeRepository;

import lombok.RequiredArgsConstructor; 

@Service
@RequiredArgsConstructor
public class IncomeService {
	
	private final CategoryRepository categoryRepository;
	
	private final IncomeRepository incomeRepository;
	
	private final ProfileService profileService;
	
	public List<IncomeDTO> getCurrentMonthIncomesForCurrentUser() {
		ProfileEntity profile = profileService.getCurrentProfile();
		
		LocalDate now = LocalDate.now();
		LocalDate startDate = now.withDayOfMonth(1);
		LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());
		
		List<IncomeEntity> list = incomeRepository.findByProfileIdAndDateBetween(profile.getId(), startDate, endDate);
		
		return list.stream().map(this::toDTO).toList();
	}
	
	public List<IncomeDTO> getLatest5IncomesForCurrentUser() {
		ProfileEntity profile = profileService.getCurrentProfile();
		
		List<IncomeEntity> list = incomeRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
		
		return list.stream().map(this::toDTO).toList();
	}
	
	public BigDecimal getTotalIncomeForCurrentUser() {
		ProfileEntity profile = profileService.getCurrentProfile();
		
		BigDecimal total = incomeRepository.findTotalIncomeByProfileId(profile.getId());
		
		return total != null ? total : BigDecimal.ZERO;
	}
	
	public List<IncomeDTO> filterIncome(LocalDate startDate, LocalDate endDate, String keyword, Sort sort) {
		ProfileEntity profile = profileService.getCurrentProfile();
		
		List<IncomeEntity> list = incomeRepository.findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
				profile.getId(), startDate, endDate, keyword, sort);
		
		return list.stream().map(this::toDTO).toList();
	}
	
	public IncomeDTO addIncome(IncomeDTO dto) {
		ProfileEntity profile = profileService.getCurrentProfile();
		
		CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
				.orElseThrow(() -> new RuntimeException("Category not Found"));
		IncomeEntity newIncome = toEntity(dto, profile, category);
		
		newIncome = incomeRepository.save(newIncome);
		
		return toDTO(newIncome);
	}
	
	public void deleteExpense(Long incomeId) {
		ProfileEntity profile = profileService.getCurrentProfile();
		
		IncomeEntity entity = incomeRepository.findById(incomeId)
				.orElseThrow(() -> new RuntimeException("Income not Found"));
		
		if(!entity.getProfile().getId().equals(profile.getId())) {
			throw new RuntimeException("Unauthorized to Delete this Income");
		}
		
		incomeRepository.delete(entity);
	}
	
	private IncomeEntity toEntity(IncomeDTO dto, ProfileEntity profile, CategoryEntity category) {
		return IncomeEntity.builder()
							.name(dto.getName())
							.icon(dto.getIcon())
							.amount(dto.getAmount())
							.date(dto.getDate())
							.profile(profile)
							.category(category)
							.build();
	}
	
	private IncomeDTO toDTO(IncomeEntity income) {
		return IncomeDTO.builder()
							.id(income.getId())
							.name(income.getName())
							.icon(income.getIcon())
							.categoryId(income.getCategory() != null ? income.getCategory().getId() : null)
							.categoryName(income.getCategory() != null ? income.getCategory().getName() : "N/A")
							.amount(income.getAmount())
							.date(income.getDate())
							.createdAt(income.getCreatedAt())
							.updatedAt(income.getUpdatedAt())
							.build();
	}
	
}
