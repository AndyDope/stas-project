package com.cdac.groupseven.stas.service;

import java.util.List;

import com.cdac.groupseven.stas.dto.ProjectDto;
import com.cdac.groupseven.stas.entity.Project;


public interface AdminService {

	int getTotalProjectCount();

	int getTotalDeveloperCount();

	int getTotalActiveProjectsCount();

	List<ProjectDto> getAllProjects();

}
