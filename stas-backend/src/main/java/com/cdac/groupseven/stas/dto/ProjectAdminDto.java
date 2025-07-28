package com.cdac.groupseven.stas.dto;

import java.time.LocalDate;

import com.cdac.groupseven.stas.enums.Status;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProjectAdminDto {
    private Long id;

    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    
    private Status status;

	public ProjectAdminDto(Long id, String title, String description, Status status, LocalDate startDate,
			LocalDate endDate) {
		super();
		this.id = id;
		this.title = title;
		this.description = description;
		this.startDate = startDate;
		this.endDate = endDate;
		this.status = status;
	}
    
    
}