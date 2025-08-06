package com.cdac.groupseven.stas.dto;

import com.cdac.groupseven.stas.entity.User;

import lombok.Data;

@Data
public class AvailableManager {
	private Long id;
	private String name;
	private int projectCount;

	public AvailableManager(User manager) {
		this.id = manager.getId();
		this.name = manager.getName();
	}
}
