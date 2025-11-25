package com.samuel.moneymanager.repositories;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.samuel.moneymanager.entities.IncomeEntity;

public interface IncomeRepository extends JpaRepository<IncomeEntity, Long> {

	// SELECT * FROM tbl_incomes WHERE profile_id = ? ORDER BY DATE DESC
	List<IncomeEntity> findByProfileIdOrderByDateDesc(Long profileId);
	
	// SELECT * FROM tbl_incomes WHERE profile_id = ? ORDER BY DATE DESC LIMIT 5
	List<IncomeEntity> findTop5ByProfileIdOrderByDateDesc(Long profileId);
	
	@Query("SELECT SUM(i.amount) FROM IncomeEntity i WHERE i.profile.id = :profileId")
	BigDecimal findTotalIncomeByProfileId(@Param("profileId") Long profileId);
	
	// SELECT * FROM tbl_incomes WHERE profile_id = ? AND date BETWEEN ? AND ? AND name LIKE %?%
	List<IncomeEntity> findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
			Long profileId, LocalDate startDate, LocalDate endDate, 
			String keyword, Sort sort
	);
	
	// SELECT * FROM tbl_incomes WHERE profile_id = ? AND date BETWEEN ? AND ? 
	List<IncomeEntity> findByProfileIdAndDateBetween(Long profileId, LocalDate startDate, LocalDate endDate);
	
}
