package com.cdac.groupseven.stas.dto;

import com.cdac.groupseven.stas.enums.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TeamWorkloadDto {
	private Long id;
    private String name;
    private String taskStatus;
    private Long totalTask;
    
    public TeamWorkloadDto(Long id, String name, String taskStatus, Long totalTask) {
		this.id = id;
		this.name = name;
		this.taskStatus = taskStatus;
		this.totalTask = totalTask;
	}
}

