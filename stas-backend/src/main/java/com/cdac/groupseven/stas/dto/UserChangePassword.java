package com.cdac.groupseven.stas.dto;

import lombok.Data;

@Data
public class UserChangePassword {
	private Long userId;
	private String oldPassword;
	private String newPassword;
}
