package com.cdac.groupseven.stas.dto;

import lombok.Data;

@Data
public class ClientDashboardStats {
	private Integer total;
	private Long active;
	private Long completed;
	private Long overdue;	
}
