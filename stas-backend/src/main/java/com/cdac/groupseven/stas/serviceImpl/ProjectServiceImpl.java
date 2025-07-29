package com.cdac.groupseven.stas.serviceImpl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.cdac.groupseven.stas.dto.MemberDto;
import com.cdac.groupseven.stas.dto.ProjectDto;
import com.cdac.groupseven.stas.entity.Project;
import com.cdac.groupseven.stas.enums.TaskStatus;
import com.cdac.groupseven.stas.repository.ProjectRepository;
import com.cdac.groupseven.stas.service.ProjectService;

@Service
public class ProjectServiceImpl implements ProjectService {
	@Autowired
	ProjectRepository projectRepository;
	
	
	public void createProject(Project project) {
		projectRepository.save(project);
	}	
	
	public Optional<Project> getProjectById(Long id) {
		return projectRepository.findById(id);
	}
	
	
	public void updateProject(long id,Project project) {
		Optional<Project> existingProject = projectRepository.findById(id);
		if(existingProject.isPresent()) {
			Project oldProject = existingProject.get();
			copyProperties(project, oldProject);
			projectRepository.save(oldProject);
		} else {
			throw new IllegalArgumentException("Project with id " + id + " does not exist");
		}
	}
	
	
	private void copyProperties(Project newProject,Project oldProject) {
		if(oldProject == null || newProject == null) {
			throw new IllegalArgumentException("Source and target objects must not be null");
		}
		
		if(newProject.getTitle() != null)
			oldProject.setTitle(newProject.getTitle());
		
		if(newProject.getDescription() != null)
			oldProject.setDescription(newProject.getDescription());
		
		if(newProject.getStatus() != null)
			oldProject.setStatus(newProject.getStatus());
		
		if(newProject.getStartDate() != null)
			oldProject.setStartDate(newProject.getStartDate());
		
		if(newProject.getEndDate() != null)
			oldProject.setEndDate(newProject.getEndDate());
		
		
	}

	@Override
    public Page<ProjectDto> findProjectsForClient(Long clientId, int page, int limit) {
        // 1. Create a Pageable object from the page and limit parameters.
        // This object tells the repository which page to fetch and how many items.
        Pageable pageable = PageRequest.of(page, limit);

        // 2. Call the repository method. It returns a Page of Project ENTITIES.
        Page<Project> projectPage = projectRepository.findByClientId(clientId, pageable);

        // 3. Convert the Page<Project> to a Page<ProjectDto>.
        // The .map() function on the Page object is the perfect tool for this.
        // It applies a conversion function to each item in the page's content list.
        return projectPage.map(this::convertToDto);
    }

    // A private helper method to handle the conversion from Entity to DTO.
    // This keeps your code clean and reusable.
    private ProjectDto convertToDto(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setStatus(project.getStatus().toString()); // Convert enum to string

        // Calculate open tasks and completion percentage
        int totalTasks = project.getTasks().size();
        long completedTasks = project.getTasks().stream()
                .filter(task -> TaskStatus.COMPLETED.equals(task.getStatus()))
                .count();
        
        dto.setOpenTasks(totalTasks - (int) completedTasks);
        dto.setCompletion(totalTasks > 0 ? (int) Math.round(((double) completedTasks / totalTasks) * 100) : 0);

        // Map member details (assuming a MemberDto exists)
        // This is where you would convert the List<ProjectMember> to a List<MemberDto>
        // For simplicity, we'll just show the count here.
        dto.setMembers(project.getMembers().stream()
                .map(member -> new MemberDto(member.getUser().getId(), member.getUser().getName()))
                .toList());

        return dto;
    }
}
