package com.cdac.groupseven.stas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserLoginRequestDto {
    private String email;
    private String password;
//    private String roleName;
}
