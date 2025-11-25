package com.samuel.moneymanager.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.samuel.moneymanager.dtos.ExpenseDTO;
import com.samuel.moneymanager.dtos.FilterDTO;
import com.samuel.moneymanager.dtos.IncomeDTO;
import com.samuel.moneymanager.services.ExpenseService;
import com.samuel.moneymanager.services.IncomeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/filter")
public class FilterController {

	private final ExpenseService expenseService;
	
	private final IncomeService incomeService;
	
	@PostMapping
	public ResponseEntity<?> filterTransactions(@RequestBody FilterDTO filter) {
		LocalDate startDate = filter.getStartDate() != null ? filter.getStartDate() : LocalDate.MIN;
		LocalDate endDate = filter.getEndDate() != null ? filter.getEndDate() : LocalDate.now();
		String keyword = filter.getKeyword() != null ? filter.getKeyword() : "";
		String sortField = filter.getSortField() != null ? filter.getSortField() : "date";
		Sort.Direction direction = "desc".equalsIgnoreCase(filter.getSortOrder()) ? 
				Sort.Direction.DESC : Sort.Direction.ASC;
		Sort sort = Sort.by(direction, sortField);
		
		if("income".equalsIgnoreCase(filter.getType())) {
			List<IncomeDTO> incomes = incomeService.filterIncome(startDate, endDate, keyword, sort);
			
			return ResponseEntity.ok(incomes);
		} else if ("expense".equalsIgnoreCase(filter.getType())) {
			List<ExpenseDTO> expenses = expenseService.filterExpense(startDate, endDate, keyword, sort);
			
			return ResponseEntity.ok(expenses);
		} else {
			return ResponseEntity.badRequest().body("Invalid Type. Must be 'income' or 'expense'");
		}
	}
}
