package com.cdac.groupseven.stas.serviceImpl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdac.groupseven.stas.dto.ProjectDto;
import com.cdac.groupseven.stas.entity.Project;
import com.cdac.groupseven.stas.enums.ProjectStatus;
import com.cdac.groupseven.stas.repository.ProjectRepository;
import com.cdac.groupseven.stas.repository.UserRepository;
import com.cdac.groupseven.stas.service.ClientService;

@Service
public class ClientServiceImpl implements ClientService {

	@Autowired
	ProjectRepository projectRepository;
	
	@Autowired
	UserRepository userRepository;
		
	@Override
	public Object getClientDashboardData(String email) {
		List<Project> projects = projectRepository.findByClientEmail(email);
		
		HashMap<String, Object> clientDashboardStats = new HashMap<>();		
		clientDashboardStats.put("pending", projects.stream().filter(project -> project.getStatus().equals(ProjectStatus.PENDING)).count());
		clientDashboardStats.put("active", projects.stream().filter(project -> project.getStatus().equals(ProjectStatus.ONGOING)).count());
		clientDashboardStats.put("completed", projects.stream().filter(project -> project.getStatus().equals(ProjectStatus.COMPLETED)).count());
		clientDashboardStats.put("overdue", projects.stream().filter(project -> project.getStatus().equals(ProjectStatus.DELAYED)).count());
		
		Map<String, Object> response = new HashMap<>();
		response.put("stats", clientDashboardStats);
		
		List<ProjectDto> projectsDto = new ArrayList<>();
		projects.forEach(project -> projectsDto.add(new ProjectDto(project)));
		
		response.put("recentProjects", projectsDto);		
		return response;
	}

	@Override
	public List<Map<String, Object>> getAllManagers() {
		List<Map<String, Object>> managers = userRepository.findAll().stream()
				.filter(user -> user.getRole().getRoleName().equals("MANAGER"))
				.map(user -> {
					Map<String, Object> managerData = new HashMap<>();
					managerData.put("id", user.getId());
					managerData.put("name", user.getName());
					managerData.put("email", user.getEmail());
					return managerData;
				})
				.toList();
		return managers;
	}
}
