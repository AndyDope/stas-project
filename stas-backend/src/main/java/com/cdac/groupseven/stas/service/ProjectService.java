package com.cdac.groupseven.stas.service;

import java.util.Optional;

import com.cdac.groupseven.stas.entity.Project;

public interface ProjectService {
	public void createProject(Project project);
	
	public Optional<Project> getProjectById(Long id);
	
	public void updateProject(long id,Project project) ;
}
