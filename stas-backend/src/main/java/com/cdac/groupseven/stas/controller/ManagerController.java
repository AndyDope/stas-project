package com.cdac.groupseven.stas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.groupseven.stas.dto.HighPriorityTaskDto;
import com.cdac.groupseven.stas.dto.ManagerDashboardStas;
import com.cdac.groupseven.stas.dto.ManagerProfileDto;
import com.cdac.groupseven.stas.dto.ManagerProjectDto;
import com.cdac.groupseven.stas.exception.ManagerNotFoundException;
import com.cdac.groupseven.stas.service.ManagerService;

@RestController
@RequestMapping("/manager")
public class ManagerController {
	
	@Autowired
	ManagerService managerService;
	
	@GetMapping("/{id}/managerstats")
	public ResponseEntity<ManagerDashboardStas> getDashboard(@PathVariable Long id) {
        ManagerDashboardStas stats = managerService.getDashboardStats(id);
        if (stats == null) {
            throw new ManagerNotFoundException(id);
        }
        return ResponseEntity.ok(stats);
    }
	
	@GetMapping("/{id}/highProirity")
	public ResponseEntity<List<HighPriorityTaskDto>> getHighPriorityTasks(@PathVariable Long id) {
	    List<HighPriorityTaskDto> tasks = managerService.getHighPriorityTasks(id);
	    return ResponseEntity.ok(tasks);
	}
	
	@GetMapping("/{id}/myProjects")
	public ResponseEntity<List<ManagerProjectDto>> getMyProjects(@PathVariable Long id) {
	    List<ManagerProjectDto> projects = managerService.getManagerProjects(id);
	    return ResponseEntity.ok(projects);
	}
	
	@GetMapping("/{id}/myProfile")
	public ResponseEntity<ManagerProfileDto> getMyProfile(@PathVariable Long id) {
	    ManagerProfileDto profile = managerService.getManagerProfile(id);
	    return ResponseEntity.ok(profile);
	}


}
