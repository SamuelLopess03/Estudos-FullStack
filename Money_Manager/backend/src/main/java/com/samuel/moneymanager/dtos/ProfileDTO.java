package com.samuel.moneymanager.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileDTO {
	
	private Long id;
	
	private String fullName;
	
	private String email;
	
	private String password;
	
	private String profileImageUrl;
	
	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;
}
