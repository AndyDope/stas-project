package com.cdac.groupseven.stas.dto;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class ClientDashboardData {
	private Map<String, Object> stats;
	private List<ProjectDto> recentProjects;
}
