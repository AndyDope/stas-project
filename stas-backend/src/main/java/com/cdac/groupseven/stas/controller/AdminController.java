package com.cdac.groupseven.stas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.groupseven.stas.dto.ProjectAdminDto;
import com.cdac.groupseven.stas.service.AdminService;

//@CrossOrigin
//(origins = "http://localhost:3000")
@RestController
@RequestMapping("/admin")
public class AdminController {
	
	
	@Autowired
	AdminService admin;
	
	@GetMapping("/totalProjectsCount")
	public int totalProjectCount() {
		return admin.getTotalProjectCount();
	}
	
	@GetMapping("/totalDeveloperCount")
	public int totalDeveloperCount() {
		return admin.getTotalDeveloperCount();
	}
	
	@GetMapping("/totalActiveProjects")
	public int totalActiveProjectsCount() {
		return admin.getTotalActiveProjectsCount();
	}
	
	@GetMapping("/getAllProjects")
	public List<ProjectAdminDto> getAllProjects() {
		return admin.getAllProjects();
	}
}
