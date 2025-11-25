package com.samuel.moneymanager.repositories;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.samuel.moneymanager.entities.ExpenseEntity;

public interface ExpenseRepository extends JpaRepository<ExpenseEntity, Long> {

	// SELECT * FROM tbl_expenses WHERE profile_id = ? ORDER BY DATE DESC
	List<ExpenseEntity> findByProfileIdOrderByDateDesc(Long profileId);
	
	// SELECT * FROM tbl_expenses WHERE profile_id = ? ORDER BY DATE DESC LIMIT 5
	List<ExpenseEntity> findTop5ByProfileIdOrderByDateDesc(Long profileId);
	
	@Query("SELECT SUM(e.amount) FROM ExpenseEntity e WHERE e.profile.id = :profileId")
	BigDecimal findTotalExpenseByProfileId(@Param("profileId") Long profileId);
	
	// SELECT * FROM tbl_expenses WHERE profile_id = ? AND date BETWEEN ? AND ? AND name LIKE %?%
	List<ExpenseEntity> findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
			Long profileId, LocalDate startDate, LocalDate endDate, 
			String keyword, Sort sort
	);
	
	// SELECT * FROM tbl_expenses WHERE profile_id = ? AND date BETWEEN ? AND ? 
	List<ExpenseEntity> findByProfileIdAndDateBetween(Long profileId, LocalDate startDate, LocalDate endDate);
	
	// SELECT * FROM tbl_expenses WHERE profile_id = ? AND date = ?
	List<ExpenseEntity> findByProfileIdAndDate(Long profileId, LocalDate date);
	
}
