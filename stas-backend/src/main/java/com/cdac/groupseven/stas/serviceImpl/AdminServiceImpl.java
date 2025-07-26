package com.cdac.groupseven.stas.serviceImpl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.cdac.groupseven.stas.dto.ProjectAdminDto;
import com.cdac.groupseven.stas.entity.Project;
import com.cdac.groupseven.stas.entity.Role;
import com.cdac.groupseven.stas.entity.User;
import com.cdac.groupseven.stas.enums.Status;
import com.cdac.groupseven.stas.repository.ProjectRepository;
import com.cdac.groupseven.stas.repository.RoleRepository;
import com.cdac.groupseven.stas.repository.UserRepository;
import com.cdac.groupseven.stas.service.AdminService;

@Component
public class AdminServiceImpl implements AdminService {

	@Autowired
	ProjectRepository projectRepo;

	@Autowired
	UserRepository userRepo;

	@Autowired
	RoleRepository roleRepo;

	@Override
	public int getTotalProjectCount() {
		return projectRepo.findAll().size();
	}

	@Override
	public int getTotalDeveloperCount() {

		Role role = roleRepo.findByRoleName("Developer").orElse(null);
		return userRepo.findByRole(role).get().size();
	}

	@Override
	public int getTotalActiveProjectsCount() {
		int count = projectRepo.findByStatus(Status.Ongoing).get().size();
		count += projectRepo.findByStatus(Status.Delayed).get().size();
		return count;
	}

	@Override
	public List<ProjectAdminDto> getAllProjects() {
	    return projectRepo.findAll().stream()
	            .map(project -> new ProjectAdminDto(
	                    project.getId(),
	                    project.getTitle(),
	                    project.getDescription(),
	                    project.getStatus(),
	                    project.getStartDate(),
	                    project.getEndDate()))
	            .collect(Collectors.toList());
	}

	
//	@Override
//	public List<ProjectAdminDto> getAllProjects() {
//		return projectRepo.findAll().stream()
//				.map(project -> new ProjectAdminDto(project.getId(), 
//						project.getTitle(), project.getDescription(), 
//						project.getStatus(), project.getStartDate(), 
//						project.getEndDate()))
//				.collect(Collectors.toList());
//	}

}
