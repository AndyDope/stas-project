package com.cdac.groupseven.stas.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.cdac.groupseven.stas.dto.ProjectDto;
import com.cdac.groupseven.stas.entity.Project;
import com.cdac.groupseven.stas.repository.ProjectRepository;

@Component
public class ClientService {


	@Autowired
	ProjectRepository projectRepo;
	
	public ProjectDto addProject(ProjectDto newProject) {
		if (newProject == null) {
	        throw new IllegalArgumentException("Project data must not be null.");
	    }
	    
	    Project project = new Project();
	    
	    project.setId(newProject.getId());
	    project.setTitle(newProject.getTitle());
	    project.setDescription(newProject.getDescription());
	    project.setStartDate(newProject.getStartDate());
	    project.setEndDate(newProject.getEndDate());
	
	    
	    projectRepo.save(project);
	    
	    return newProject;
	}

}
