package com.cdac.groupseven.stas.dto;

import lombok.Data;

@Data
public class UserUpdateDto {
	private Long id;
	private String name;
	private String email;
	private String role;
}
