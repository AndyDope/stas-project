package com.cdac.groupseven.stas.dto;

import com.cdac.groupseven.stas.entity.Role;

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
//    private String token;
}
