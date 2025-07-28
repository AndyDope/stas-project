package com.cdac.groupseven.stas.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.groupseven.stas.dto.ProjectDto;
import com.cdac.groupseven.stas.entity.Project;
import com.cdac.groupseven.stas.repository.ProjectRepository;
import com.cdac.groupseven.stas.service.ClientService;

@RestController
@RequestMapping("/client")
public class ClientController {
	
	@Autowired
	ClientService clientService;
	
	@PostMapping("/addProject")
	public ProjectDto addProject(@RequestBody ProjectDto newProject) {
	    return clientService.addProject(newProject);
	}
	
	
	
}
