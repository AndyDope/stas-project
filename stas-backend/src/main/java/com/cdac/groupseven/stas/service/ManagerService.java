package com.cdac.groupseven.stas.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;

import org.springframework.http.ResponseEntity;

import com.cdac.groupseven.stas.dto.CreateTaskRequest;
import com.cdac.groupseven.stas.dto.HighPriorityTaskDto;
import com.cdac.groupseven.stas.dto.ManagerDashboardStas;
import com.cdac.groupseven.stas.dto.ManagerProfileDto;
import com.cdac.groupseven.stas.dto.ManagerProjectDto;
import com.cdac.groupseven.stas.dto.ManagerUpdateProjectRequestDto;
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

	ResponseEntity<List<HashMap<String, Object>>> getDeveloperTasksInProject(Long managerId, Long projectId,
			Long developerId);

	ResponseEntity<List<HashMap<String, Object>>> getReceivedFeedbacks(Long managerId);

	ResponseEntity<List<HashMap<String, Object>>> getProjectTasks(Long managerId, Long projectId);

	ResponseEntity<HashMap<String, Object>> getProjectDetails(Long managerId, Long projectId);

	ResponseEntity<List<HashMap<String, Object>>> getAvailableDevelopers(Long managerId);

	ResponseEntity<String> addDeveloperToProject(Long managerId, Long projectId, HashMap<String, Object> requestBody);

	ResponseEntity<String> removeDeveloperFromProject(Long managerId, Long projectId,
			HashMap<String, Object> requestBody);

	ResponseEntity<Object> updateProjectDetails(Long managerId, Long projectId,
			ManagerUpdateProjectRequestDto requestDto);

	ResponseEntity<List<HashMap<String, Object>>> getManagerTasks(Long managerId);


}