package com.cdac.groupseven.stas.service;

import java.util.Map;

import com.cdac.groupseven.stas.dto.UserManageDto;
import com.cdac.groupseven.stas.dto.UserSignupRequestDto;

public interface AdminService {

	Map<String, Object> getAdminDashboardData();
	UserManageDto createAdminUser(UserSignupRequestDto dto);
}
