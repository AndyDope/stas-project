package com.cdac.groupseven.stas.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.groupseven.stas.service.DeveloperService;

@RestController
@RequestMapping("/developer")
public class DeveloperController {
	
	@Autowired
	DeveloperService developerService;
	//GetMapping  developer/${developerId}/dashboardStats
	
	@GetMapping("{developerId}/dashboardStats")
	public ResponseEntity<Map<String,Object>> getDeveloperDashboardStats(@PathVariable("developerId") Long developerId) {
		return ResponseEntity.ok(developerService.getDeveloperDashboardStats(developerId));
	}
	
	//GetMApping ${developerId}/myTasks
	@GetMapping("{developerId}/myTasks")
	public ResponseEntity<List<Map<String, Object>>> getMyTasks(@PathVariable("developerId") Long developerId) {
		return ResponseEntity.ok(developerService.getMyTasks(developerId));
	}
	
	@GetMapping("{developerId}/myAllTasks")
	public ResponseEntity<List<Map<String, Object>>> getAllTasks(@PathVariable("developerId") Long developerId) {
		return ResponseEntity.ok(developerService.getAllTasks(developerId));
	}
	
	@PutMapping("{developerId}/task/{taskId}/updateTask")
	public ResponseEntity<String> updateTask(@PathVariable("developerId") Long developerId, @PathVariable("taskId") Long taskId,@RequestBody Map<String,Object> data) {
		// Logic to assign task to developer
		return ResponseEntity.ok(developerService.updateTask(developerId, taskId,data));
	}
	
	//http://localhost:80/api/developer/skills
	@GetMapping("/{id}/skills")
	public ResponseEntity<List<String>> getSkills(@PathVariable("id") Long id) {
		// Logic to get skills
		return ResponseEntity.ok(developerService.getSkills(id));
	}
	
	@GetMapping("/allSkills")
	public ResponseEntity<List<String>> getAllSkills() {
		// Logic to get all skills
		return ResponseEntity.ok(developerService.getAllSkills());
	}
	
	//`http://localhost:80/developer/${user.id}/addSkills`
	@PostMapping("/{id}/addSkills")
	public ResponseEntity<String> addSkills(@PathVariable("id") Long id, @RequestBody Map<String,String> skills) {
		// Logic to add skills
		return ResponseEntity.ok(developerService.addSkills(id, skills));
	}
	
	//developer/${userId}/feedbacks
	@GetMapping("{userId}/feedbacks")
	public ResponseEntity<List<Map<String, Object>>> getFeedbacks(@PathVariable("userId") Long userId) {
		// Logic to get feedbacks
		return ResponseEntity.ok(developerService.getFeedbacks(userId));
	}
}
