package com.cdac.groupseven.stas.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class NewProject {
	private Long clientId;
	private LocalDate completionDate;
	private String description;
	private String title;
	private Long managerId;
}
