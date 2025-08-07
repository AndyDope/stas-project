package com.cdac.groupseven.stas.service;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;

public interface DeveloperService {

	Map<String, Object> getDeveloperDashboardStats(Long developerId);

	List<Map<String, Object>> getMyTasks(Long developerId);

	List<Map<String, Object>> getAllTasks(Long developerId);

	String updateTask(Long developerId, Long taskId, Map<String, Object> data);

	List<String> getSkills(Long id);

	List<String> getAllSkills();

	String addSkills(Long id, Map<String, String> skills);

	List<Map<String, Object>> getFeedbacks(Long userId);

	String deleteSkills(Long id, Map<String, String> skills);

}
