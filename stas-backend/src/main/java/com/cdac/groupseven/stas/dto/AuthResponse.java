package com.cdac.groupseven.stas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserDto user; // A DTO of the user, not the entity
}