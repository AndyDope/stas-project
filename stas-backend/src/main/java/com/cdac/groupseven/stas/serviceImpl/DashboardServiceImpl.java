package com.cdac.groupseven.stas.serviceImpl;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdac.groupseven.stas.dto.ClientDashboardStats;
import com.cdac.groupseven.stas.entity.Project;
import com.cdac.groupseven.stas.enums.ProjectStatus;
import com.cdac.groupseven.stas.repository.ProjectRepository;
import com.cdac.groupseven.stas.repository.UserRepository;
import com.cdac.groupseven.stas.service.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService {

	@Autowired
	ProjectRepository projectRepository;
	
	@Autowired
	UserRepository userRepository;
		
	@Override
	public Object getClientStats(Long id) {
		List<Project> projects = projectRepository.findByClient_Id(id).get();
		
		HashMap<String, Object> clientDashboardStats = new HashMap<>();
		
		clientDashboardStats.put("pending", projects.stream().filter(project -> project.getStatus().equals(ProjectStatus.PENDING)).count());
		clientDashboardStats.put("active", projects.stream().filter(project -> project.getStatus().equals(ProjectStatus.ONGOING)).count());
		clientDashboardStats.put("completed", projects.stream().filter(project -> project.getStatus().equals(ProjectStatus.COMPLETED)).count());
		clientDashboardStats.put("overdue", projects.stream().filter(project -> project.getStatus().equals(ProjectStatus.DELAYED)).count());
		
//		ClientDashboardStats clientDashboardStats = new ClientDashboardStats();
		
//		clientDashboardStats.setTotal(projects.size());
//		clientDashboardStats.setActive(projects.stream().filter(project -> project.getStatus().equals(ProjectStatus.ONGOING)).count());
//		clientDashboardStats.setCompleted(projects.stream().filter(project -> project.getStatus().equals(ProjectStatus.COMPLETED)).count());
//		clientDashboardStats.setOverdue(projects.stream().filter(project -> project.getStatus().equals(ProjectStatus.DELAYED)).count());
		
		return clientDashboardStats;
	}
}
