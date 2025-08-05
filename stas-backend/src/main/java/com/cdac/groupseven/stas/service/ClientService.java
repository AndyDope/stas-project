package com.cdac.groupseven.stas.service;

import java.util.List;
import java.util.Map;

public interface ClientService {

//	public Object getClientDashboardData(Long id);
	public Object getClientDashboardData(String email);

	public List<Map<String,Object>> getAllManagers();
}
