package com.samuel.moneymanager.controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.samuel.moneymanager.services.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
public class DashboardController {
	
	private final DashboardService dashboardService;
	
	@GetMapping
	public ResponseEntity<Map<String, Object>> getDashboardData() {
		Map<String, Object> dashboardData = dashboardService.getDashboardData();
		
		return ResponseEntity.ok(dashboardData);
	}
}
