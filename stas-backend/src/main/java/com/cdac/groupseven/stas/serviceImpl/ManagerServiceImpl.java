package com.cdac.groupseven.stas.serviceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.cdac.groupseven.stas.dto.HighPriorityTaskDto;
import com.cdac.groupseven.stas.dto.ManagerDashboardStas;
import com.cdac.groupseven.stas.dto.ManagerProfileDto;
import com.cdac.groupseven.stas.dto.ManagerProjectDto;
import com.cdac.groupseven.stas.entity.Project;
import com.cdac.groupseven.stas.entity.User;
import com.cdac.groupseven.stas.enums.TaskStatus;
import com.cdac.groupseven.stas.exception.ManagerNotFoundException;
import com.cdac.groupseven.stas.repository.UserRepository;
import com.cdac.groupseven.stas.service.ManagerService;

public class ManagerServiceImpl implements ManagerService{

	@Autowired
	UserRepository userRepository;
	
	@Override
	public ManagerDashboardStas getDashboardStats(Long id) {
	    Optional<User> managerOptional = userRepository.findById(id);

	    if (managerOptional.isEmpty()) {
	        return null;
	    }

	    User manager = managerOptional.get();
	    List<Project> projects = manager.getProjects();

	    long openTask = projects.stream()
	        .flatMap(project -> project.getTasks().stream())
	        .filter(task -> task.getStatus() != TaskStatus.COMPLETED)
	        .count();

	    long overdueTask = projects.stream()
	        .flatMap(project -> project.getTasks().stream())
	        .filter(task -> task.getStatus() == TaskStatus.OVERDUE)
	        .count();

	    long teamMember = projects.stream()
	        .mapToLong(project -> project.getMembers().size())
	        .sum();

	    ManagerDashboardStas stats = new ManagerDashboardStas();
	    stats.setTotalProject(projects.size());
	    stats.setOpenTask(openTask);
	    stats.setOverdueTask(overdueTask);
	    stats.setTeamMember(teamMember);

	    return stats;
	}

	@Override
	public List<HighPriorityTaskDto> getHighPriorityTasks(Long managerId) {
	    Optional<User> managerOptional = userRepository.findById(managerId);
	    if (managerOptional.isEmpty()) {
	        throw new ManagerNotFoundException(managerId);
	    }

	    User manager = managerOptional.get();

	    return manager.getProjects().stream()
	        .flatMap(project -> project.getTasks().stream())
	        .filter(task -> task.getStatus() == TaskStatus.OVERDUE)
	        .map(task -> {
	            HighPriorityTaskDto dto = new HighPriorityTaskDto();
	            dto.setId(task.getId());
	            dto.setTitle(task.getTitle());
	            dto.setDescription(task.getDescription());
	            dto.setDueDate(task.getDueDate());
	            dto.setStatus(task.getStatus());
	            return dto;
	        })
	        .toList();
	}
	
	@Override
	public List<ManagerProjectDto> getManagerProjects(Long managerId) {
	    Optional<User> managerOptional = userRepository.findById(managerId);
	    if (managerOptional.isEmpty()) {
	        throw new ManagerNotFoundException(managerId);
	    }

	    User manager = managerOptional.get();

	    return manager.getProjects().stream()
	        .map(project -> {
	            ManagerProjectDto dto = new ManagerProjectDto();
	            dto.setId(project.getId());
	            dto.setTitle(project.getTitle());
	            dto.setDescription(project.getDescription());
	            dto.setStartDate(project.getStartDate());
	            dto.setEndDate(project.getEndDate());
	            dto.setStatus(project.getStatus().toString());
	            return dto;
	        })
	        .toList();
	}
	
	@Override
	public ManagerProfileDto getManagerProfile(Long id) {
	    Optional<User> managerOptional = userRepository.findById(id);
	    if (managerOptional.isEmpty()) {
	        throw new ManagerNotFoundException(id);
	    }

	    User manager = managerOptional.get();
	    ManagerProfileDto dto = new ManagerProfileDto();
	    dto.setId(manager.getId());
	    dto.setName(manager.getName());
	    dto.setEmail(manager.getEmail());
	    dto.setRoleName(manager.getRole().getRoleName());
	    return dto;
	}




}
