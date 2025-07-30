package com.cdac.groupseven.stas.service;

import java.util.List;

import com.cdac.groupseven.stas.dto.HighPriorityTaskDto;
import com.cdac.groupseven.stas.dto.ManagerDashboardStas;
import com.cdac.groupseven.stas.dto.ManagerProfileDto;
import com.cdac.groupseven.stas.dto.ManagerProjectDto;

public interface ManagerService {

	ManagerDashboardStas getDashboardStats(Long id);
	
	List<HighPriorityTaskDto> getHighPriorityTasks(Long managerId);

	List<ManagerProjectDto> getManagerProjects(Long managerId);
	
	ManagerProfileDto getManagerProfile(Long id);


}
