package com.cdac.groupseven.stas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.groupseven.stas.dto.AvailableManager;
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
	@PreAuthorize("hasRole('CLIENT')")
	public ResponseEntity<Object> getClientDashboardData() {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String userEmail = userDetails.getUsername();

		return ResponseEntity.ok(clientService.getClientDashboardData(userEmail));
	}

	@GetMapping("/projects")
	@PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT') or hasRole('MANAGER')")
	public ResponseEntity<Object> getProjects(
			// @RequestParam tells Spring to look for "?page=..." in the URL
			@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "limit", defaultValue = "5") int limit) {

		// Now you can use the 'page' and 'limit' variables to fetch data
		// Your service layer would handle the database query
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String userEmail = userDetails.getUsername();

		return ResponseEntity.ok(projectService.findProjectsForClient(userEmail, page, limit));
	}

	@GetMapping("/projects/{id}")
	@PreAuthorize("hasRole('CLIENT') or hasRole('MANAGER')")
	public ResponseEntity<ProjectDto> getprojectById(@PathVariable Long id) {

		return ResponseEntity.ok(projectService.getProjectById(id));
	}
	
	@PutMapping("/projects/{projectId}")
	@PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT')")
	public ResponseEntity<ProjectDto> updateProject(@PathVariable Long projectId, @RequestBody NewProject newProject) {
		return ResponseEntity.ok(projectService.clientUpdateProject(projectId, newProject));
//		return null;
	}

	@PostMapping("/project")
	@PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT')")
	public ResponseEntity<?> createNewProject(@RequestBody NewProject newProject) {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		try {
			return ResponseEntity.ok(projectService.createNewProject(userDetails.getUsername(), newProject));
        } catch (Exception e) {
        	System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().body("Error creating project: " + e.getMessage());
        }
	}
	
	@GetMapping("/available-managers")
	@PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT')")
	public ResponseEntity<List<AvailableManager>> getAvailableManagers() {
		return ResponseEntity.ok(clientService.getAvailableManagers());
	}
}
