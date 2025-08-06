package com.cdac.groupseven.stas.service;

import java.util.List;
import java.util.Map;

import com.cdac.groupseven.stas.dto.AvailableManager;

public interface ClientService {

	public Map<String, Object> getClientDashboardData(String email);
	public List<AvailableManager> getAvailableManagers();
}
