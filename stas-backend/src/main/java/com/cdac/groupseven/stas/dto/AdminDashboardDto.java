package com.cdac.groupseven.stas.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDto {
    private int totalUsers;
    private int totalProjects;
    private int taskCompleted;
    private int skillsDefined;

    private Map<String, Integer> userRoleDistribution; // ✅ Add this
}