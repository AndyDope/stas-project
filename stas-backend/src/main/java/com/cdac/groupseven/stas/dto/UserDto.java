package com.cdac.groupseven.stas.dto;

import com.cdac.groupseven.stas.entity.Role;
import com.cdac.groupseven.stas.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    
    
    // Constructor to build DTO from User entity
    public UserDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole() != null ? user.getRole() : null;
    }
}
