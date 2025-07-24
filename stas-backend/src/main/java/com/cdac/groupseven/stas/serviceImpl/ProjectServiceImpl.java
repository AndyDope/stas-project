package com.cdac.groupseven.stas.serviceImpl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.cdac.groupseven.stas.entity.Project;
import com.cdac.groupseven.stas.repository.ProjectRepository;
import com.cdac.groupseven.stas.service.ProjectService;

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
}
