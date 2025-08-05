package com.cdac.groupseven.stas.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class NewProject {

	private Long managerId;
	private LocalDate endDate;
	private String description;
	private String title;
}
