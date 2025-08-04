package com.cdac.groupseven.stas.dto;

import com.cdac.groupseven.stas.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String name;
    private String email;
    private String roleName;
    private String token;

    // Constructor to build DTO from User entity
    public UserResponseDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.roleName = user.getRole() != null ? user.getRole().getRoleName() : null;
        this.token = null; // Set this separately if needed
    }
}