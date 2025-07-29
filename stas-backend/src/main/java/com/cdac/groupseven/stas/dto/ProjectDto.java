package com.cdac.groupseven.stas.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.cdac.groupseven.stas.entity.Project;
import com.cdac.groupseven.stas.enums.TaskStatus;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProjectDto {
	private Long id;
	private String title;
	private String description;
	private LocalDate startDate;
	private LocalDate endDate;
	private String status;
	private Long client;
	private List<MemberDto> members;
	private Map<Long, String> tasks;
	private Integer openTasks;
	private Integer completion;
		
	public ProjectDto(Project project) {
		
		id = project.getId();
		title = project.getTitle();
		description = project.getDescription();
		startDate = project.getStartDate();
		endDate = project.getEndDate();
		status = project.getStatus().name();
		client = project.getClient().getId();
		
		members = new ArrayList<>();
		project.getMembers().forEach(member -> members.add(new MemberDto(member.getUser().getId(), member.getUser().getName())));
		
		tasks = new HashMap<>();
		project.getTasks().forEach(task -> tasks.put(task.getId(), task.getStatus().name()));
		
		int totalTasks = project.getTasks().size();
		long completedTasks = project.getTasks().stream()
                .filter(task -> TaskStatus.COMPLETED.equals(task.getStatus()))
                .count();
        
		openTasks = totalTasks - (int) completedTasks;
		completion = totalTasks > 0 ? (int) Math.round(((double) completedTasks / totalTasks) * 100) : 0;
		
	}
}
