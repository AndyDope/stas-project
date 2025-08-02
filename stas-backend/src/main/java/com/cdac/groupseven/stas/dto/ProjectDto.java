package com.cdac.groupseven.stas.dto;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

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
	private String status;
	private Integer completion;
	private LocalDate startDate;
	private LocalDate endDate;
	private Map<String, Object> client;
	private Map<String, Object> manager;
	private Set<MemberDto> members;
	private Set<TaskDto> tasks;
	private Integer openTasks;
	public ProjectDto(Project project) {
		
		id = project.getId();
		title = project.getTitle();
		description = project.getDescription();
		startDate = project.getStartDate();
		endDate = project.getEndDate();
		status = project.getStatus().name();
		
		client = new HashMap<>();
		client.put("id", project.getClient().getId());
		client.put("name", project.getClient().getName());
		
		
		if (project.getManager() != null) {
			manager = new HashMap<>();
			manager.put("id", project.getManager().getId());
			manager.put("name", project.getManager().getName());
		}
		
		if (project.getMembers() != null) {
			members = new HashSet<>();		
			project.getMembers().forEach(member -> members.add(new MemberDto(member.getUser().getId(), member.getUser().getName())));
		}
		if (project.getTasks() != null) {
			tasks = new HashSet<>();
			project.getTasks().forEach(task -> tasks.add(new TaskDto(task)));
			int totalTasks = project.getTasks().size();
			long completedTasks = project.getTasks().stream()
					.filter(task -> TaskStatus.COMPLETED.equals(task.getStatus()))
					.count();
			
			openTasks = totalTasks - (int) completedTasks;
			completion = totalTasks > 0 ? (int) Math.round(((double) completedTasks / totalTasks) * 100) : 0;
		}				
	}
}
