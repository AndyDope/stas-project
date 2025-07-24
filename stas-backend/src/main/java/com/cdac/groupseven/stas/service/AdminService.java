package com.cdac.groupseven.stas.service;

import java.util.List;

import com.cdac.groupseven.stas.dto.ProjectAdminDto;
import com.cdac.groupseven.stas.entity.Project;


public interface AdminService {

	int getTotalProjectCount();

	int getTotalDeveloperCount();

	int getTotalActiveProjectsCount();

	List<ProjectAdminDto> getAllProjects();

}
