package com.samuel.moneymanager.controllers;

import java.io.IOException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.samuel.moneymanager.services.ExcelService;
import com.samuel.moneymanager.services.ExpenseService;
import com.samuel.moneymanager.services.IncomeService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/excel")
@RequiredArgsConstructor
public class ExcelController {
	
	private final ExcelService excelService;
	
	private final IncomeService incomeService;
	
	private final ExpenseService expenseService;
	
	@GetMapping("/download/income")
	public void downloadIncomeExcel(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		response.setHeader("Content-Disposition", "attachment; filename=income.xlsx");
		
		excelService.writeIncomesToExcel(response.getOutputStream(), incomeService.getCurrentMonthIncomesForCurrentUser());
	}
	
	@GetMapping("/download/expense")
	public void downloadExpenseExcel(HttpServletResponse response) throws IOException {
		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		response.setHeader("Content-Disposition", "attachment; filename=expense.xlsx");
		
		excelService.writeExpensesToExcel(response.getOutputStream(), expenseService.getCurrentMonthExpensesForCurrentUser());
	}
}
