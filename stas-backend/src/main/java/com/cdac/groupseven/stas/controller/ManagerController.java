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
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Project project = projectOpt.get();
        if (!project.getManager().getId().equals(managerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        boolean isMember = project.getMembers().stream()
            .anyMatch(pm -> pm.getUser().getId().equals(developerId));
        if (!isMember) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<HashMap<String, Object>> tasks = project.getTasks().stream()
            .filter(task -> task.getAssignedDevelopers().stream()
                .anyMatch(ut -> ut.getDeveloper().getId().equals(developerId)))
            .map(task -> {
                HashMap<String, Object> map = new HashMap<>();
                map.put("id", task.getId());
                map.put("title", task.getTitle());
                map.put("description", task.getDescription());
                map.put("status", task.getStatus());
                map.put("dueDate", task.getDueDate());
                return map;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(tasks);
    }
	
	@GetMapping("/{managerId}/receivedFeedbacks")
    public ResponseEntity<List<HashMap<String, Object>>> getReceivedFeedbacks(@PathVariable Long managerId) {
        List<Project> projects = projectRepository.findByManager_Id(managerId).orElse(List.of());
        List<HashMap<String, Object>> feedbacks = new ArrayList<>();
        for (Project project : projects) {
            for (Task task : project.getTasks()) {
                List<Feedback> taskFeedbacks = feedbackRepository.findByTask(task);
                for (Feedback fb : taskFeedbacks) {
                    if (fb.getGivenBy() != null && fb.getGivenBy().getRole() != null &&
                        "client".equalsIgnoreCase(fb.getGivenBy().getRole().getRoleName())) {
                        HashMap<String, Object> map = new HashMap<>();
                        map.put("content", fb.getContent());
                        map.put("projectTitle", project.getTitle());
                        HashMap<String, Object> client = new HashMap<>();
                        client.put("id", fb.getGivenBy().getId());
                        client.put("name", fb.getGivenBy().getName());
                        map.put("client", client);
                        HashMap<String, Object> givenTo = new HashMap<>();
                        givenTo.put("id", managerId);
                        // Assuming manager name is same for all projects, get from project.getManager()
                        givenTo.put("name", project.getManager() != null ? project.getManager().getName() : "");
                        map.put("givenTo", givenTo);
                        feedbacks.add(map);
                    }
                }
            }
        }
        return ResponseEntity.ok(feedbacks);
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
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Project project = projectOpt.get();
        if (!project.getManager().getId().equals(managerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<HashMap<String, Object>> tasks = project.getTasks().stream()
            .map(task -> {
                HashMap<String, Object> map = new HashMap<>();
                map.put("id", task.getId());
                map.put("title", task.getTitle());
                map.put("description", task.getDescription());
                map.put("status", task.getStatus());
                map.put("dueDate", task.getDueDate());
                
                // Get the assigned developer (assuming one developer per task)
                if (!task.getAssignedDevelopers().isEmpty()) {
                    UserTask userTask = task.getAssignedDevelopers().get(0);
                    HashMap<String, Object> developer = new HashMap<>();
                    developer.put("id", userTask.getDeveloper().getId());
                    developer.put("name", userTask.getDeveloper().getName());
                    map.put("assignedTo", developer);
                }
                
                return map;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(tasks);
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
		Optional<Project> projectOpt = projectRepository.findById(projectId);
		if (projectOpt.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		Project project = projectOpt.get();
		if (!project.getManager().getId().equals(managerId)) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}
		HashMap<String, Object> response = new HashMap<>();
		response.put("id", project.getId());
		response.put("title", project.getTitle());
		response.put("description", project.getDescription());
		response.put("status", project.getStatus());
		response.put("startDate", project.getStartDate());
		response.put("endDate", project.getEndDate());
		// Tasks
		List<Task> tasks = project.getTasks();
		response.put("totalTasks", tasks.size());
		long openTasks = tasks.stream().filter(t -> t.getStatus() != null && !t.getStatus().toString().equalsIgnoreCase("Completed")).count();
		System.out.println("Open Tasks: " + openTasks);
		response.put("openTasks", openTasks);
		// Client
		HashMap<String, Object> client = new HashMap<>();
		if (project.getClient() != null) {
			client.put("id", project.getClient().getId());
			client.put("name", project.getClient().getName());
			client.put("email", project.getClient().getEmail());
		}
		response.put("client", client);
		// Members
		List<HashMap<String, Object>> members = new ArrayList<>();
		if (project.getMembers() != null) {
			for (var pm : project.getMembers()) {
				HashMap<String, Object> member = new HashMap<>();
				member.put("id", pm.getUser().getId());
				member.put("name", pm.getUser().getName());
				member.put("email", pm.getUser().getEmail());
				members.add(member);
			}
		}
		response.put("members", members);
		// Tasks summary
		List<HashMap<String, Object>> taskList = new ArrayList<>();
		for (Task t : tasks) {
			HashMap<String, Object> tMap = new HashMap<>();
			tMap.put("id", t.getId());
			tMap.put("title", t.getTitle());
			tMap.put("status", t.getStatus());
			taskList.add(tMap);
		}
		response.put("tasks", taskList);
		return ResponseEntity.ok(response);
	}
	
	
	//getmapping for  manager/${managerId}/available-developers
	@GetMapping("/{managerId}/available-developers")
    public ResponseEntity<List<HashMap<String, Object>>> getAvailableDevelopers(@PathVariable Long managerId) {
        // Fetch all users with role 'developer' who are not assigned to any project
		Optional<User> manager = userRepository.findById(managerId);
        List<com.cdac.groupseven.stas.entity.User> allDevelopers = userRepository.findAll().stream().
			filter(user -> user.getRole() != null && "developer".equalsIgnoreCase(user.getRole().getRoleName()))
			.collect(Collectors.toList());
        List<com.cdac.groupseven.stas.entity.User> availableDevelopers = allDevelopers.stream()
            .filter(dev -> dev.getProjectMemberships() == null || dev.getProjectMemberships().isEmpty())
            .toList();
        List<HashMap<String, Object>> response = new ArrayList<>();
        for (var dev : availableDevelopers) {
            HashMap<String, Object> map = new HashMap<>();
            map.put("id", dev.getId());
            map.put("name", dev.getName());
            map.put("email", dev.getEmail());
            response.add(map);
        }
        return ResponseEntity.ok(response);
    }

	//POST /manager/{managerId}/project/{projectId}/add-developer
	@PostMapping("/{managerId}/project/{projectId}/add-developer")
    public ResponseEntity<String> addDeveloperToProject(
            @PathVariable Long managerId,
            @PathVariable Long projectId,
            @RequestBody HashMap<String, Object> requestBody) {
        // Expecting: { "developer_id": 123 }
        Long developerId;
        try {
            developerId = Long.valueOf(requestBody.get("developerId").toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid developer_id");
        }
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Project not found");
        }
        Project project = projectOpt.get();
        if (!project.getManager().getId().equals(managerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized");
        }
        Optional<User> developerOpt = userRepository.findById(developerId);
        if (developerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Developer not found");
        }
        User developer = developerOpt.get();
        // Check if developer is already assigned to a project
        if (developer.getProjectMemberships() != null && !developer.getProjectMemberships().isEmpty()) {
            return ResponseEntity.badRequest().body("Developer is already assigned to a project");
        }
        // Add developer to project
        com.cdac.groupseven.stas.entity.ProjectMember member = new com.cdac.groupseven.stas.entity.ProjectMember();
        member.setProject(project);
        member.setUser(developer);
        // Ensure lists are initialized
        if (project.getMembers() == null) {
            project.setMembers(new ArrayList<>());
        }
        if (developer.getProjectMemberships() == null) {
            developer.setProjectMemberships(new ArrayList<>());
        }
        project.getMembers().add(member);
        developer.getProjectMemberships().add(member);
        // Persist ProjectMember entity
        projectMemberRepository.save(member);
        return ResponseEntity.ok("Developer added to project successfully");
    }


	// POST /manager/{managerId}/project/{projectId}/remove-developer
    @PostMapping("/{managerId}/project/{projectId}/remove-developer")
    public ResponseEntity<String> removeDeveloperFromProject(
            @PathVariable Long managerId,
            @PathVariable Long projectId,
            @RequestBody HashMap<String, Object> requestBody) {
        Long developerId;
        try {
            developerId = Long.valueOf(requestBody.get("developerId").toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid developerId");
        }
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Project not found");
        }
        Project project = projectOpt.get();
        if (!project.getManager().getId().equals(managerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized");
        }
        Optional<User> developerOpt = userRepository.findById(developerId);
        if (developerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Developer not found");
        }
        User developer = developerOpt.get();
        // Check if developer is a member of the project
        var memberOpt = project.getMembers().stream()
            .filter(pm -> pm.getUser().getId().equals(developerId))
            .findFirst();
        if (memberOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Developer is not a member of this project");
        }
        // Check if developer has any tasks allotted in this project
        boolean hasTask = project.getTasks().stream()
            .anyMatch(task -> task.getAssignedDevelopers().stream()
                .anyMatch(ut -> ut.getDeveloper().getId().equals(developerId)));
        if (hasTask) {
            return ResponseEntity.badRequest().body("Developer has tasks allotted in this project");
        }
        // Remove ProjectMember from project and developer
        var member = memberOpt.get();
        project.getMembers().remove(member);
        developer.getProjectMemberships().remove(member);
        projectMemberRepository.delete(member);
        return ResponseEntity.ok("Developer removed from project successfully");
    }
    
    
    //put /manager/${managerId}/project/${projectId} give {
//    title: "",
//    description: "",
//    startDate: "",
//    endDate: "",
//    status: "",
//  }
//    give impl and update the project details and if status is changed to completed then check if all the tasks  are completed then only change the status to complete e
    // PUT /manager/${managerId}/project/${projectId}
    @PutMapping("/{managerId}/project/{projectId}")
    public ResponseEntity<Object> updateProjectDetails(
            @PathVariable Long managerId,
            @PathVariable Long projectId,
            @RequestBody ManagerUpdateProjectRequestDto requestDto) {
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Project not found");
        }
        Project project = projectOpt.get();
        

        
        if (!project.getManager().getId().equals(managerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized");
        }
        // Update fields
        System.out.println(requestDto.getTitle());
        if (requestDto.getTitle() != null) {
            project.setTitle(requestDto.getTitle());
        }
        
        System.out.println(requestDto.getDescription());
        if (requestDto.getDescription() != null) {
            project.setDescription(requestDto.getDescription());
        }
        System.out.println(requestDto.getStartDate());
        if (requestDto.getStartDate() != null) {
            try {
                project.setStartDate(LocalDate.parse(requestDto.getStartDate()));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Invalid startDate format");
            }
        }
        System.out.println(requestDto.getEndDate());
        if (requestDto.getEndDate() != null) {
            try {
                project.setEndDate(LocalDate.parse(requestDto.getEndDate()));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Invalid endDate format");
            }
        }
        System.out.println(requestDto.getStatus());
        if (requestDto.getStatus() != null) {
            String newStatus = requestDto.getStatus();
            if (newStatus.equalsIgnoreCase("COMPLETED")) {
                boolean allTasksCompleted = project.getTasks().stream()
                    .allMatch(task -> task.getStatus() != null && task.getStatus().toString().equalsIgnoreCase("COMPLETED"));
                if (!allTasksCompleted) {
                    return ResponseEntity.badRequest().body("Cannot mark project as COMPLETED unless all tasks are completed");
                }
                project.setStatus(com.cdac.groupseven.stas.enums.ProjectStatus.Completed);
            } else {
                try {
                    project.setStatus(com.cdac.groupseven.stas.enums.ProjectStatus.valueOf(newStatus));
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body("Invalid status value");
                }
            }
        }
        
        System.out.println(project.getId());
        System.out.println(project.getTitle());
        System.out.println(project.getStatus());
        System.out.println(project.getStartDate());
        System.out.println(project.getEndDate());
        projectRepository.save(project);
        return ResponseEntity.ok(requestDto);
    }
    
    // GET /manager/{managerId}/tasks
    @GetMapping("/{managerId}/tasks")
    public ResponseEntity<List<HashMap<String, Object>>> getManagerTasks(@PathVariable Long managerId) {
        List<Project> projects = projectRepository.findByManager_Id(managerId).orElse(List.of());
        List<HashMap<String, Object>> tasks = new ArrayList<>();
        for (Project project : projects) {
            for (Task task : project.getTasks()) {
                HashMap<String, Object> map = new HashMap<>();
                map.put("id", task.getId());
                map.put("title", task.getTitle());
                map.put("description", task.getDescription());
                map.put("status", task.getStatus());
                map.put("dueDate", task.getDueDate());
                HashMap<String, Object> projectMap = new HashMap<>();
                projectMap.put("id", project.getId());
                projectMap.put("title", project.getTitle());
                map.put("project", projectMap);
                tasks.add(map);
            }
        }
        return ResponseEntity.ok(tasks);
    }

}
