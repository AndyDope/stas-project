package com.cdac.groupseven.stas.serviceImpl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.cdac.groupseven.stas.dto.CreateTaskRequest;
import com.cdac.groupseven.stas.dto.HighPriorityTaskDto;
import com.cdac.groupseven.stas.dto.ManagerDashboardStas;
import com.cdac.groupseven.stas.dto.ManagerGiveFeedbackRequest;
import com.cdac.groupseven.stas.dto.ManagerProfileDto;
import com.cdac.groupseven.stas.dto.ManagerProjectDto;
import com.cdac.groupseven.stas.dto.ManagerUpdateProjectRequestDto;
import com.cdac.groupseven.stas.dto.MemberDto;
import com.cdac.groupseven.stas.dto.TeamWorkloadDto;
import com.cdac.groupseven.stas.dto.UpdateTaskRequest;
import com.cdac.groupseven.stas.entity.Feedback;
import com.cdac.groupseven.stas.entity.Project;
import com.cdac.groupseven.stas.entity.ProjectMember;
import com.cdac.groupseven.stas.entity.Task;
import com.cdac.groupseven.stas.entity.User;
import com.cdac.groupseven.stas.entity.UserSkill;
import com.cdac.groupseven.stas.entity.UserTask;
import com.cdac.groupseven.stas.enums.ProjectStatus;
import com.cdac.groupseven.stas.enums.TaskStatus;
import com.cdac.groupseven.stas.exception.ManagerNotFoundException;
import com.cdac.groupseven.stas.repository.FeedbackRepository;
import com.cdac.groupseven.stas.repository.ProjectMemberRepository;
import com.cdac.groupseven.stas.repository.ProjectRepository;
import com.cdac.groupseven.stas.repository.TaskRepository;
import com.cdac.groupseven.stas.repository.UserRepository;
import com.cdac.groupseven.stas.service.ManagerService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Component
public class ManagerServiceImpl implements ManagerService{

	@Autowired
	private ProjectRepository projectRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private FeedbackRepository feedbackRepository;
	
	@Autowired
	private TaskRepository taskRepository;
	
	@PersistenceContext
    private EntityManager entityManager;
	
	@Autowired
	private ProjectMemberRepository projectMemberRepository;
	
	
	
	@Override
	public ManagerDashboardStas getDashboardStats(Long id) {
	    Optional<User> managerOptional = userRepository.findById(id);

	    if (managerOptional.isEmpty()) {
	        return null;
	    }

	    User manager = managerOptional.get();
	    Optional<List<Project>> optionalProject = projectRepository.findByManager_Id(id);
	    List<Project> projects = optionalProject.get();

	    long openTask = 0;
	    long overdueTask = 0;

	    Set<Long> memberIds = new HashSet<>();

	    for (Project project : projects) {
	        for (Task task : project.getTasks()) {
	            if (task.getStatus() != TaskStatus.COMPLETED) {
	                openTask++;
	            }
	            if (task.getStatus() == TaskStatus.OVERDUE) {
	                overdueTask++;
	            }
	        }
	        for (ProjectMember pm : project.getMembers()) {
	            memberIds.add(pm.getUser().getId());
	        }
	    }

	    ManagerDashboardStas stats = new ManagerDashboardStas();
	    stats.setTotalProject(projects.size());
	    stats.setOpenTask(openTask);
	    stats.setOverdueTask(overdueTask);
	    stats.setTeamMember((long) memberIds.size());

	    return stats;
	}


	@Override
	public List<HighPriorityTaskDto> getHighPriorityTasks(Long managerId) {
	    Optional<User> managerOptional = userRepository.findById(managerId);
	    if (managerOptional.isEmpty()) {
	        throw new ManagerNotFoundException(managerId);
	    }

	    User manager = managerOptional.get();

	    return manager.getProjects().stream()
	        .flatMap(project -> project.getTasks().stream())
	        .filter(task -> task.getStatus() == TaskStatus.OVERDUE)
	        .map(task -> {
	            HighPriorityTaskDto dto = new HighPriorityTaskDto();
	            dto.setId(task.getId());
	            dto.setTitle(task.getTitle());
	            dto.setProjectTitle(task.getProject().getTitle());
	            dto.setDescription(task.getDescription());
	            dto.setDueDate(task.getDueDate());
	            dto.setStatus(task.getStatus());
	            return dto;
	        })
	        .toList();
	}
	
	public List<ManagerProjectDto> getManagerProjects( Long id) {
	    Optional<User> managerOpt = userRepository.findById(id);

	    User manager = managerOpt.get();
	    Optional<List<Project>> optionalprojects = projectRepository.findByManager_Id(manager.getId());
	    List<Project> projects = optionalprojects.get();
	    List<ManagerProjectDto> managerProjectDto = projects.stream().map(project -> {
	        List<Task> openTasks = project.getTasks().stream()
	            .filter(task -> task.getStatus() != TaskStatus.COMPLETED)
	            .collect(Collectors.toList());
	        int totalTasks = project.getTasks().size();
	        int completedTasks = (int) project.getTasks().stream()
	            .filter(task -> task.getStatus() == TaskStatus.COMPLETED)
	            .count();
	        int completion = totalTasks -completedTasks;

	        List<MemberDto> members = project.getMembers().stream()
	            .map(member -> new MemberDto(member.getUser().getId(), member.getUser().getName()))
	            .collect(Collectors.toList());

	        return new ManagerProjectDto(
	            project.getId(),
	            project.getTitle(),
	            project.getDescription(),
	            project.getStatus().name(),
	            openTasks.size(),
	            completion,
	            project.getStartDate(),
	            project.getEndDate(),
	            members
	        );
	    }).collect(Collectors.toList());
	    
	    return (managerProjectDto);
	}

	
	@Override
	public ManagerProfileDto getManagerProfile(Long id) {
	    Optional<User> managerOptional = userRepository.findById(id);
	    if (managerOptional.isEmpty()) {
	        throw new ManagerNotFoundException(id);
	    }

	    User manager = managerOptional.get();
	    ManagerProfileDto dto = new ManagerProfileDto();
	    dto.setId(manager.getId());
	    dto.setName(manager.getName());
	    dto.setEmail(manager.getEmail());
	    dto.setRoleName(manager.getRole().getRoleName());
	    return dto;
	}


//	@Override
//	public List<TeamWorkloadDto> getTeamWorkload(Long id) {
//		
//		Optional<User> managerOptional = userRepository.findById(id);
//		if (managerOptional.isEmpty()) {
//			throw new ManagerNotFoundException(id);
//		}
//		User manager = managerOptional.get();
//		Set<User> teamMembers = manager.getProjects().stream()
//		        .flatMap(project -> project.getMembers().stream())
//		        .map(ProjectMember::getUser)
//		        .collect(Collectors.toSet());
//		List<TeamWorkloadDto> teamWorkloadDto = new ArrayList<TeamWorkloadDto>();
//		
//		teamMembers.stream().
//		        forEach(member -> {
//		            long totalTasks = (long) member.getAssignedTasks().size();
//		            long completedTasks = member.getAssignedTasks().stream()
//		                    .filter(task -> task.getStatus() != null && task.getStatus().equalsIgnoreCase("Completed"))
//		                    .count();
//		            TaskStatus status = member.getAssignedTasks().stream()
//		                    .map(Task::getStatus)
//		                    .filter(Objects::nonNull)
//		                    .max(Comparator.comparingInt(status -> priorityMap.getOrDefault(status, 0)))
//		                    .orElse(null);
//		            long openTasks = totalTasks - completedTasks;
//		            teamWorkloadDto.add(new TeamWorkloadDto(member.getId(), member.getName(),status.toString() , openTasks));
//		        });
//			
//		return teamWorkloadDto;
//		
//	}
	
	@Override
	public List<TeamWorkloadDto> getTeamWorkload(Long id) {
	    Optional<User> managerOptional = userRepository.findById(id);
	    if (managerOptional.isEmpty()) {
	        throw new ManagerNotFoundException(id);
	    }
	    User manager = managerOptional.get();
	    Set<User> teamMembers = manager.getProjects().stream()
	            .flatMap(project -> project.getMembers().stream())
	            .map(ProjectMember::getUser)
	            .collect(Collectors.toSet());
	    List<TeamWorkloadDto> teamWorkloadDto = new ArrayList<>();

	    teamMembers.forEach(member -> {
	        // Get all UserTask assignments for this member
	        List<UserTask> userTasks = member.getAssignedTasks();
	        long totalTasks = userTasks.size();
	        long completedTasks = userTasks.stream()
	                .map(UserTask::getTask)
	                .filter(task -> task.getStatus() == TaskStatus.COMPLETED)
	                .count();
	        // Find the highest priority status among assigned tasks
	        TaskStatus highestPriorityStatus = userTasks.stream()
	                .map(UserTask::getTask)
	                .map(Task::getStatus)
	                .filter(Objects::nonNull)
	                .max(Comparator.comparingInt(TaskStatus::getPriority))
	                .orElse(null);
	        long openTasks = totalTasks - completedTasks;
	        teamWorkloadDto.add(new TeamWorkloadDto(
	                member.getId(),
	                member.getName(),
	                highestPriorityStatus != null ? highestPriorityStatus.toString() : null,
	                openTasks
	        ));
	    });

	    return teamWorkloadDto;
	}



	@Override
	public HashSet<Object> getTeamMembers(Long managerId, Long projectId) {
		Optional<Project> projectOpt = projectRepository.findById(projectId);
	    if (projectOpt.isEmpty()) {
	        return null;
	    }
	    Project project = projectOpt.get();
	    if (!project.getManager().getId().equals(managerId)) {
	        return null;
	    }
	    HashSet<Object> members = project.getMembers().stream()
	        .map(pm -> new Object() {
	            public Long id = pm.getUser().getId();
	            public String name = pm.getUser().getName();
	            public String email = pm.getUser().getEmail();
	            public List<String> skills = pm.getUser().getUserSkills().stream()
	                .map(UserSkill::getSkill)
	                .map(skill -> skill.getName())
	                .collect(Collectors.toList());
	        })
	        .collect(Collectors.toCollection(HashSet::new));
	    return members;
	}
	

	@Override
	public List<HashMap<String, Object>> getManagerFeedbacks(Long managerId) {
	    Optional<User> managerOpt = userRepository.findById(managerId);
	    if (managerOpt.isEmpty()) return null;
	    User manager = managerOpt.get();
	    List<Feedback> feedbacks = feedbackRepository.findByAuthor(manager);

	    List<HashMap<String, Object>> result = new ArrayList<HashMap<String, Object>>();
	    for (Feedback fb : feedbacks) {
	        HashMap<String, Object> map = new HashMap<>();
	        map.put("projectId", fb.getTask().getProject().getId());
	        map.put("projectTitle", fb.getTask().getProject().getTitle());
	        map.put("developerId", fb.getRecipient().getId());
	        map.put("developerName", fb.getRecipient().getName());
	        map.put("taskTitle", fb.getTask().getTitle());
	        map.put("feedback", fb.getContent());
	        map.put("rating", fb.getRating());
	        result.add(map);
	    }
	    return result;
	}

	
	@Override
	public boolean giveFeedback(Long managerId, ManagerGiveFeedbackRequest request) {
	    Optional<User> managerOpt = userRepository.findById(managerId);
	    Optional<User> developerOpt = userRepository.findById(request.getDeveloperId());
	    Optional<Project> projectOpt = projectRepository.findById(request.getProjectId());

	    if (managerOpt.isEmpty() || developerOpt.isEmpty() || projectOpt.isEmpty()) {
	        return false;
	    }

	    Project project = projectOpt.get();
	    User manager = managerOpt.get();
	    User developer = developerOpt.get();

	    // Ensure the manager is the manager of the project
	    if (!project.getManager().getId().equals(managerId)) {
	        return false;
	    }

	    // Ensure the developer is a member of the project
	    boolean isMember = project.getMembers().stream()
	        .anyMatch(pm -> pm.getUser().getId().equals(developer.getId()));
	    if (!isMember) {
	        return false;
	    }

	    // Find a task in the project assigned to the developer
	    Task task = project.getTasks().stream()
	        .filter(t -> t.getAssignedDevelopers().stream()
	            .anyMatch(ut -> ut.getDeveloper().getId().equals(developer.getId())))
	        .findFirst()
	        .orElse(null);

	    if (task == null) {
	        return false;
	    }

	    Feedback feedback = new Feedback();
	    feedback.setTask(task);
	    feedback.setRecipient(developer);
	    feedback.setAuthor(manager);
	    feedback.setRating(request.getRating());
	    feedback.setContent(request.getContent());

	    feedbackRepository.save(feedback);
	    return true;
	}


	@Override
	@Transactional
	public boolean createTask(Long managerId, CreateTaskRequest request) {
        Optional<User> managerOpt = userRepository.findById(managerId);
        Optional<User> developerOpt = userRepository.findById(request.getAssignedTo());
        Optional<Project> projectOpt = projectRepository.findById(request.getProjectId());

        if (managerOpt.isEmpty() || developerOpt.isEmpty() || projectOpt.isEmpty()) {
            return false;
        }
        User manager = managerOpt.get();
        User developer = developerOpt.get();
        Project project = projectOpt.get();
        // Validate manager is the manager of the project
        if (!project.getManager().getId().equals(managerId)) {
            return false;
        }
        // Create Task
        System.out.println("Creating task for project: " + project.getTitle());
        System.out.println("Creating task for project: " + project.getTitle());
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setStatus(TaskStatus.ACTIVE);
        task.setProject(project);
        task.setManager(manager);
        entityManager.persist(task);
        // Assign developer to task
        UserTask userTask = new UserTask();
        userTask.setDeveloper(developer);
        userTask.setTask(task);
        entityManager.persist(userTask);
        return true;
    }
	
	@Override
	@Transactional
	public boolean updateTask(Long managerId, Long taskId, UpdateTaskRequest request) {
        try {
            // Get task
            Optional<Task> taskOpt = taskRepository.findById(taskId);
            if (taskOpt.isEmpty()) {
                return false;
            }

            Task task = taskOpt.get();

            // Validate manager owns this task
            if (!task.getProject().getManager().getId().equals(managerId)) {
                return false;
            }

            // Update task fields
            task.setTitle(request.getTitle());
            task.setDescription(request.getDescription());
            task.setDueDate(request.getDueDate());
            task.setStatus(request.getStatus());

            // Handle developer reassignment
            if (request.getAssignedTo() != null) {
                Optional<User> newDeveloperOpt = userRepository.findById(request.getAssignedTo());
                if (newDeveloperOpt.isPresent()) {
                    User newDeveloper = newDeveloperOpt.get();
                    
                    // Clear existing assignments
                    task.getAssignedDevelopers().clear();
                    
                    // Create new assignment
                    UserTask userTask = new UserTask();
                    userTask.setDeveloper(newDeveloper);
                    userTask.setTask(task);
                    task.getAssignedDevelopers().add(userTask);
                }
            }

            // Save the updated task
            taskRepository.save(task);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
	
	@Override
	public ResponseEntity<List<HashMap<String, Object>>> getDeveloperTasksInProject(Long managerId, Long projectId, Long developerId) {
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
	
	@Override
	public ResponseEntity<List<HashMap<String, Object>>> getReceivedFeedbacks(Long managerId) {
		List<Project> projects = projectRepository.findByManager_Id(managerId).orElse(List.of());
        List<HashMap<String, Object>> feedbacks = new ArrayList<>();
        for (Project project : projects) {
            for (Task task : project.getTasks()) {
                List<Feedback> taskFeedbacks = feedbackRepository.findByTask(task);
                for (Feedback fb : taskFeedbacks) {
                    if (fb.getAuthor() != null && fb.getAuthor().getRole() != null &&
                        "client".equalsIgnoreCase(fb.getAuthor().getRole().getRoleName())) {
                        HashMap<String, Object> map = new HashMap<>();
                        map.put("content", fb.getContent());
                        map.put("projectTitle", project.getTitle());
                        HashMap<String, Object> client = new HashMap<>();
                        client.put("id", fb.getAuthor().getId());
                        client.put("name", fb.getAuthor().getName());
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
	
	
	@Override
	public ResponseEntity<List<HashMap<String, Object>>> getProjectTasks(Long managerId, Long projectId) {
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
	
	@Override
	public ResponseEntity<HashMap<String, Object>> getProjectDetails(Long managerId, Long projectId) {
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
		List<Task> tasks =  project.getTasks().stream().collect(Collectors.toList()) ;
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
	
	@Override
	public ResponseEntity<List<HashMap<String, Object>>> getAvailableDevelopers(Long managerId) {
		Optional<User> manager = userRepository.findById(managerId);
        List<User> allDevelopers = userRepository.findAll().stream().
			filter(user -> user.getRole() != null && "developer".equalsIgnoreCase(user.getRole().getRoleName()))
			.collect(Collectors.toList());
        List<User> availableDevelopers = allDevelopers.stream()
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

	@Override
	public ResponseEntity<String> addDeveloperToProject(Long managerId, Long projectId, HashMap<String, Object> requestBody) {
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
            project.setMembers(new HashSet<>());
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

	@Override
	public ResponseEntity<String> removeDeveloperFromProject(Long managerId, Long projectId, HashMap<String, Object> requestBody) {
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

	@Override
	public ResponseEntity<Object> updateProjectDetails(Long managerId, Long projectId,
			ManagerUpdateProjectRequestDto requestDto) {
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
                project.setStatus(ProjectStatus.COMPLETED);
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
	
	@Override
	public ResponseEntity<List<HashMap<String, Object>>> getManagerTasks(Long managerId) {
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