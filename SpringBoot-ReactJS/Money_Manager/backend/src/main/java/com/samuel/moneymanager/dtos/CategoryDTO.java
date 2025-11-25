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
public class CategoryDTO {
	
	private Long id;
	
	private Long profileId;
	
	private String name;
	
	private String icon;
	
	private String type;
	
	private LocalDateTime createdAt;
	
	private LocalDateTime updatedAt;
}
