package com.cdac.groupseven.stas.serviceImpl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.cdac.groupseven.stas.dto.CreateTaskRequest;
import com.cdac.groupseven.stas.dto.HighPriorityTaskDto;
import com.cdac.groupseven.stas.dto.ManagerDashboardStas;
import com.cdac.groupseven.stas.dto.ManagerGiveFeedbackRequest;
import com.cdac.groupseven.stas.dto.ManagerProfileDto;
import com.cdac.groupseven.stas.dto.ManagerProjectDto;
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
import com.cdac.groupseven.stas.enums.TaskStatus;
import com.cdac.groupseven.stas.exception.ManagerNotFoundException;
import com.cdac.groupseven.stas.repository.FeedbackRepository;
import com.cdac.groupseven.stas.repository.ProjectRepository;
import com.cdac.groupseven.stas.repository.TaskRepository;
import com.cdac.groupseven.stas.repository.UserRepository;
import com.cdac.groupseven.stas.service.ManagerService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Component
public class ManagerServiceImpl implements ManagerService{

	@Autowired
	ProjectRepository projectRepository;
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	FeedbackRepository feedbackRepository;
	
	@Autowired
	private TaskRepository taskRepository;
	
	@PersistenceContext
    private EntityManager entityManager;
	
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
		List<TeamWorkloadDto> teamWorkloadDto = new ArrayList<TeamWorkloadDto>();
		
		teamMembers.stream().
		        forEach(member -> {
		            long totalTasks = (long) member.getAssignedTasks().size();
		            long completedTasks = member.getAssignedTasks().stream()
		                    .filter(task -> task.getStatus() != null && task.getStatus().equalsIgnoreCase("Completed"))
		                    .count();
		            long openTasks = totalTasks - completedTasks;
		            teamWorkloadDto.add(new TeamWorkloadDto(member.getId(), member.getName(),"Overdue" , openTasks));
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
	    List<Feedback> feedbacks = feedbackRepository.findByGivenBy(manager);

	    List<HashMap<String, Object>> result = new ArrayList<HashMap<String, Object>>();
	    for (Feedback fb : feedbacks) {
	        HashMap<String, Object> map = new HashMap<>();
	        map.put("projectId", fb.getTask().getProject().getId());
	        map.put("projectTitle", fb.getTask().getProject().getTitle());
	        map.put("developerId", fb.getDeveloper().getId());
	        map.put("developerName", fb.getDeveloper().getName());
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
	    feedback.setDeveloper(developer);
	    feedback.setGivenBy(manager);
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


}