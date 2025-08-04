package com.cdac.groupseven.stas.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

import com.cdac.groupseven.stas.dto.CreateTaskRequest;
import com.cdac.groupseven.stas.dto.HighPriorityTaskDto;
import com.cdac.groupseven.stas.dto.ManagerDashboardStas;
import com.cdac.groupseven.stas.dto.ManagerProfileDto;
import com.cdac.groupseven.stas.dto.ManagerProjectDto;
import com.cdac.groupseven.stas.dto.TeamWorkloadDto;
import com.cdac.groupseven.stas.dto.UpdateTaskRequest;

public interface ManagerService {

	ManagerDashboardStas getDashboardStats(Long id);
	
	List<HighPriorityTaskDto> getHighPriorityTasks(Long managerId);

	List<ManagerProjectDto> getManagerProjects(Long managerId);
	
	ManagerProfileDto getManagerProfile(Long id);

	List<TeamWorkloadDto> getTeamWorkload(Long id);

	HashSet<Object> getTeamMembers(Long managerId, Long projectId);

	List<HashMap<String, Object>> getManagerFeedbacks(Long managerId);
	
	boolean giveFeedback(Long managerId, com.cdac.groupseven.stas.dto.ManagerGiveFeedbackRequest request);

	boolean createTask(Long managerId, CreateTaskRequest request);

	boolean updateTask(Long managerId, Long taskId, UpdateTaskRequest request);


}