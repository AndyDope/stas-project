package com.cdac.groupseven.stas.dto;

import lombok.Data;

@Data
public class ManagerProfileDto {
    private Long id;
    private String name;
    private String email;
    private String roleName;  // Role (like MANAGER, ADMIN, etc.)
}

