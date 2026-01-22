package com.samuel.moneymanager.controllers;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.samuel.moneymanager.entities.ProfileEntity;
import com.samuel.moneymanager.services.EmailService;
import com.samuel.moneymanager.services.ExcelService;
import com.samuel.moneymanager.services.ExpenseService;
import com.samuel.moneymanager.services.IncomeService;
import com.samuel.moneymanager.services.ProfileService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailController {

	private final ExcelService excelService;
	
	private final IncomeService incomeService;
	
	private final ExpenseService expenseService;
	
	private final EmailService emailService;
	
	private final ProfileService profileService;
	
	@GetMapping("/income-excel")
	public ResponseEntity<Void> emailIncomeExcel() throws IOException, MessagingException {
		ProfileEntity profile = profileService.getCurrentProfile();
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		
		excelService.writeIncomesToExcel(baos, incomeService.getCurrentMonthIncomesForCurrentUser());
		emailService.sendEmailWithAttachment(profile.getEmail(), 
				"Your Income Excel Report", 
				"Please Find Attached Your Income Report", 
				baos.toByteArray(), 
				"income.xlsx");
		
		return ResponseEntity.ok(null);
	}
	
	@GetMapping("/expense-excel")
	public ResponseEntity<Void> emailExpenseExcel() throws IOException, MessagingException {
		ProfileEntity profile = profileService.getCurrentProfile();
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		
		excelService.writeExpensesToExcel(baos, expenseService.getCurrentMonthExpensesForCurrentUser());
		emailService.sendEmailWithAttachment(profile.getEmail(), 
				"Your Expense Excel Report", 
				"Please Find Attached Your Expense Report", 
				baos.toByteArray(), 
				"expense.xlsx");
		
		return ResponseEntity.ok(null);
	}
}
