package com.cdac.groupseven.stas.service;

import com.cdac.groupseven.stas.dto.ClientDashboardStats;

public interface DashboardService {

	public ClientDashboardStats getClientStats(Long id);
}
