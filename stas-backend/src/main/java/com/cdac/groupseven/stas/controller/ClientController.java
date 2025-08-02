package com.cdac.groupseven.stas.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.groupseven.stas.dto.NewProject;
import com.cdac.groupseven.stas.dto.ProjectDto;
import com.cdac.groupseven.stas.service.ClientService;
import com.cdac.groupseven.stas.service.ProjectService;

@RestController
@RequestMapping("/api/client")
public class ClientController {
	
	@Autowired
	ClientService clientService;
	
	@Autowired
	ProjectService projectService; 
	
	@GetMapping("/dashboard-data")
	public ResponseEntity<Object> getClientDashboardData(@RequestParam(value = "id") Long id) {
		return ResponseEntity.ok(clientService.getClientDashboardData(id));
	}
	
	@GetMapping("/projects")
	public ResponseEntity<Object> getProjects(
            // @RequestParam tells Spring to look for "?page=..." in the URL			
			@RequestParam(value = "id") Long id, 
            @RequestParam(value = "page", defaultValue = "0") int page, 
            @RequestParam(value = "limit", defaultValue = "5") int limit) {
		
        // Now you can use the 'page' and 'limit' variables to fetch data
        // Your service layer would handle the database query
		return ResponseEntity.ok(projectService.findProjectsForClient(id, page, limit));
	}
	
	@GetMapping("/projects/{id}")
	public ResponseEntity<ProjectDto> getprojectById(@PathVariable Long id) {		
		return ResponseEntity.ok(projectService.getProjectById(id));
	}
	
	@PostMapping("/project")
	public ResponseEntity<ProjectDto> createNewProject(@RequestBody NewProject newProject) {
		return ResponseEntity.ok(projectService.createNewProject(newProject));
	}
}
