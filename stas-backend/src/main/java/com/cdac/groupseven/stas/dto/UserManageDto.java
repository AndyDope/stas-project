// dto/UserManageDto.java
package com.cdac.groupseven.stas.dto;

import com.cdac.groupseven.stas.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserManageDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    
    public UserManageDto(User user) {
		this.id = user.getId();
		this.name = user.getName();
		this.email = user.getEmail();
		this.role = user.getRole() != null ? user.getRole().getRoleName() : "No Role Assigned";
	}
    
}