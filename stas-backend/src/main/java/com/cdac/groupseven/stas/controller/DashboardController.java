package com.cdac.groupseven.stas.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.groupseven.stas.dto.ClientDashboardStats;
import com.cdac.groupseven.stas.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
	
	@Autowired
	DashboardService dashboardService;
	
	@GetMapping("/client-stats/{id}")
	public ResponseEntity<ClientDashboardStats> getClientStats(@PathVariable Long id) {
		return ResponseEntity.ok(dashboardService.getClientStats(id));
	}
}
