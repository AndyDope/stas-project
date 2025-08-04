package com.cdac.groupseven.stas.dto;

import com.cdac.groupseven.stas.entity.Task;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskDto {
	private Long id;
	private String title;
	private String description;
	private String status;
	
	public TaskDto(Task newTask) {
		id = newTask.getId();
		title = newTask.getTitle();
		description = newTask.getDescription();
		status = newTask.getStatus().name();
	}
}
