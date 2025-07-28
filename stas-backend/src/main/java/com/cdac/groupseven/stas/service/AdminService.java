package com.cdac.groupseven.stas.service;

import java.util.List;

import com.cdac.groupseven.stas.dto.ProjectDto;


public interface AdminService {

	int getTotalProjectCount();

	int getTotalDeveloperCount();

	int getTotalActiveProjectsCount();

	List<ProjectDto> getAllProjects();

}
