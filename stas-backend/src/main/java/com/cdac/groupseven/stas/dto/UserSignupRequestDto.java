package com.cdac.groupseven.stas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data //for getters setters and toString and also RequireArgsConstructor
public class UserSignupRequestDto {
    private String name;
    private String email;
    private String password;
    private Long roleId; // e.g., "4 -Developer", "3 -Manager", etc.
}