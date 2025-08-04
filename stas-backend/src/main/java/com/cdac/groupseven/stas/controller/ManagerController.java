package com.cdac.groupseven.stas.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.groupseven.stas.dto.ManagerGiveFeedbackRequest;
import com.cdac.groupseven.stas.dto.HighPriorityTaskDto;
import com.cdac.groupseven.stas.dto.ManagerDashboardStas;
import com.cdac.groupseven.stas.dto.ManagerProfileDto;
import com.cdac.groupseven.stas.dto.ManagerProjectDto;
import com.cdac.groupseven.stas.dto.ManagerUpdateProjectRequestDto;
import com.cdac.groupseven.stas.dto.MemberDto;
import com.cdac.groupseven.stas.dto.TeamWorkloadDto;
import com.cdac.groupseven.stas.dto.UpdateTaskRequest;
import com.cdac.groupseven.stas.entity.Feedback;
import com.cdac.groupseven.stas.entity.Project;
import com.cdac.groupseven.stas.entity.Task;
import com.cdac.groupseven.stas.entity.User;
import com.cdac.groupseven.stas.entity.UserTask;
import com.cdac.groupseven.stas.repository.FeedbackRepository;
import com.cdac.groupseven.stas.repository.ProjectMemberRepository;
import com.cdac.groupseven.stas.repository.ProjectRepository;
import com.cdac.groupseven.stas.repository.UserRepository;
import com.cdac.groupseven.stas.enums.ProjectStatus;
import com.cdac.groupseven.stas.exception.ManagerNotFoundException;
import com.cdac.groupseven.stas.service.ManagerService;
import com.cdac.groupseven.stas.dto.CreateTaskRequest;

@RestController
@RequestMapping("/manager")
@CrossOrigin(origins = "http://localhost:5173")
public class ManagerController {
	
	@Autowired
	ManagerService managerService;
	
	@Autowired
	ProjectRepository projectRepository;
	
	@Autowired
	FeedbackRepository feedbackRepository;
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	ProjectMemberRepository projectMemberRepository;
	
	@GetMapping("/{id}/managerstats")
	public ResponseEntity<ManagerDashboardStas> getDashboard(@PathVariable Long id) {
        ManagerDashboardStas stats = managerService.getDashboardStats(id);
        if (stats == null) {
            throw new ManagerNotFoundException(id);
        }
        return ResponseEntity.ok(stats);
    }
	
	@GetMapping("/{id}/highProirity")
	public ResponseEntity<List<HighPriorityTaskDto>> getHighPriorityTasks(@PathVariable Long id) {
	    List<HighPriorityTaskDto> tasks = managerService.getHighPriorityTasks(id);
	    return ResponseEntity.ok(tasks);
	}
	
	@GetMapping("/{id}/myProjects")
	public ResponseEntity<List<ManagerProjectDto>> getMyProjects(@PathVariable Long id) {
	    List<ManagerProjectDto> projects = managerService.getManagerProjects(id);
	    return ResponseEntity.ok(projects);
	}
	
	@GetMapping("/{id}/myProfile")
	public ResponseEntity<ManagerProfileDto> getMyProfile(@PathVariable Long id) {
	    ManagerProfileDto profile = managerService.getManagerProfile(id);
	    
	    return ResponseEntity.ok(profile);
	}
	
	@GetMapping("/{id}/teamWorkload")
	public ResponseEntity<List<TeamWorkloadDto>> getTeamWorkload(@PathVariable Long id) {
		List<TeamWorkloadDto> profile = managerService.getTeamWorkload(id);
	    
	    return ResponseEntity.ok(profile);
	}
	
	@GetMapping("/{managerId}/project/{projectId}/teamMembers")
	public ResponseEntity<HashSet<Object>> getTeamMembers(
	        @PathVariable Long managerId,
	        @PathVariable Long projectId) {
		HashSet<Object> members = managerService.getTeamMembers(managerId, projectId);
	    if (members == null) {
	        return ResponseEntity.notFound().build();
	    }
		return ResponseEntity.ok(members);
	}
	
	@PostMapping("/{managerId}/giveFeedback")
    public ResponseEntity<String> giveFeedback(
            @PathVariable Long managerId,
            @RequestBody ManagerGiveFeedbackRequest request) {
        boolean success = managerService.giveFeedback(managerId, request);
        if (success) {
            return ResponseEntity.ok("Feedback submitted successfully.");
        } else {
            return ResponseEntity.badRequest().body("Invalid data or operation.");
        }
    }
	
	@GetMapping("/{managerId}/feedbacks")
    public ResponseEntity<List<HashMap<String, Object>>> getManagerFeedbacks(@PathVariable Long managerId) {
        List<HashMap<String, Object>> feedbacks = managerService.getManagerFeedbacks(managerId);
        if (feedbacks == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(feedbacks);
    }
	
	@GetMapping("/{managerId}/project/{projectId}/teamMembers/{developerId}/tasks")
    public ResponseEntity<List<HashMap<String, Object>>> getDeveloperTasksInProject(
            @PathVariable Long managerId,
            @PathVariable Long projectId,
            @PathVariable Long developerId) {
        return managerService.getDeveloperTasksInProject(managerId, projectId, developerId);
    }

	
	
	@GetMapping("/{managerId}/receivedFeedbacks")
    public ResponseEntity<List<HashMap<String, Object>>> getReceivedFeedbacks(@PathVariable Long managerId) {
        return managerService.getReceivedFeedbacks(managerId);
    }

	
	
	@PostMapping("/{managerId}/createtask")
    public ResponseEntity<String> createTask(
            @PathVariable Long managerId,
            @RequestBody CreateTaskRequest request) {
        boolean success = managerService.createTask(managerId, request);
        if (success) {
            return ResponseEntity.ok("Task created successfully.");
        } else {
            return ResponseEntity.badRequest().body("Invalid data or operation.");
        }
    }
	
	@GetMapping("/{managerId}/project/{projectId}/tasks")
    public ResponseEntity<List<HashMap<String, Object>>> getProjectTasks(
            @PathVariable Long managerId,
            @PathVariable Long projectId) {
        return managerService.getProjectTasks(managerId, projectId);
    }

	
	
	@PutMapping("/{managerId}/task/{taskId}")
	public ResponseEntity<String> updateTask(
			@PathVariable Long managerId,
			@PathVariable Long taskId,
			@RequestBody UpdateTaskRequest request) {
		try {
			boolean success = managerService.updateTask(managerId, taskId, request);
			if (success) {
				return ResponseEntity.ok("Task updated successfully");
			} else {
				return ResponseEntity.badRequest().body("Failed to update task");
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body("Error updating task");
		}
	}
	
	@GetMapping("/{managerId}/project/{projectId}")
	public ResponseEntity<HashMap<String, Object>> getProjectDetails(
			@PathVariable Long managerId,
			@PathVariable Long projectId) {
		return managerService.getProjectDetails(managerId, projectId);
	}

	
	@GetMapping("/{managerId}/available-developers")
    public ResponseEntity<List<HashMap<String, Object>>> getAvailableDevelopers(@PathVariable Long managerId) {
        // Fetch all users with role 'developer' who are not assigned to any project
		return managerService.getAvailableDevelopers(managerId);
    }

	

	@PostMapping("/{managerId}/project/{projectId}/add-developer")
    public ResponseEntity<String> addDeveloperToProject(
            @PathVariable Long managerId,
            @PathVariable Long projectId,
            @RequestBody HashMap<String, Object> requestBody) {
        return managerService.addDeveloperToProject(managerId, projectId, requestBody);
    }

	

	// POST /manager/{managerId}/project/{projectId}/remove-developer
    @PostMapping("/{managerId}/project/{projectId}/remove-developer")
    public ResponseEntity<String> removeDeveloperFromProject(
            @PathVariable Long managerId,
            @PathVariable Long projectId,
            @RequestBody HashMap<String, Object> requestBody) {
        return managerService.removeDeveloperFromProject(managerId, projectId, requestBody);
    }

	
    
    
    @PutMapping("/{managerId}/project/{projectId}")
    public ResponseEntity<Object> updateProjectDetails(
            @PathVariable Long managerId,
            @PathVariable Long projectId,
            @RequestBody ManagerUpdateProjectRequestDto requestDto) {
        return managerService.updateProjectDetails(managerId, projectId, requestDto);
    }

	
    @GetMapping("/{managerId}/tasks")
    public ResponseEntity<List<HashMap<String, Object>>> getManagerTasks(@PathVariable Long managerId) {
        return managerService.getManagerTasks(managerId);
    }

	

}
